import json
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

# ── CONFIG ──────────────────────────────────────────────
OLLAMA_API_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.2:1b"  # Lightweight 1B model designed for fast local inference without OOM
# ────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are an accurate medical triage assistant for disaster management. Categorize the victim's reported injury into exactly ONE priority:

- "RED": Immediate life-threatening emergency (severe uncontrolled bleeding, unconsciousness, severe breathing failure, chest crush, shock).
- "YELLOW": Urgent medical condition but stable (broken limbs, deep cuts with controlled bleeding, high fever, severe pain, immobilized).
- "GREEN": Minor injury or non-urgent (small cuts, minor scratches, mild fever, fatigue, uninjured, stranded needing basic food/water).

ACCURACY RULES:
- Do NOT classify minor cuts, scratches, mild dehydration, or fatigue as RED. Be objective and realistic.
- Only assign RED if there is an immediate risk to life or breathing.
- Output strictly in valid JSON without any surrounding text or markdown.

Schema:
{
  "priority": "RED" | "YELLOW" | "GREEN",
  "reasoning": "Brief explanation of symptoms and why this level was selected.",
  "recommended_action": "Action instructions for rescue workers."
}"""

FEW_SHOT_EXAMPLES = """
Example 1:
Input SOS: "I have a small cut on my knee. A bit scared but fine, just need a bandage."
Output: {
  "priority": "GREEN",
  "reasoning": "Victim has a minor superficial knee cut with no heavy bleeding or life threat.",
  "recommended_action": "Provide basic first aid kit with bandage and antiseptic."
}

Example 2:
Input SOS: "I have a broken arm and a gash on my forehead. I can walk but need medical attention."
Output: {
  "priority": "YELLOW",
  "reasoning": "Victim has a bone fracture and forehead wound, but is conscious, mobile, and stable.",
  "recommended_action": "Dispatch basic medical team with arm splint and wound dressing."
}

Example 3:
Input SOS: "My leg is crushed under a concrete slab, I can't move and I'm bleeding heavily. Please help!"
Output: {
  "priority": "RED",
  "reasoning": "Victim suffers from severe crush injury with major uncontrolled hemorrhage.",
  "recommended_action": "Dispatch emergency trauma team with heavy extraction equipment and blood loss controls immediately."
}
"""

@app.route('/classify', methods=['POST'])
def classify_sos():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Missing 'text' in request body"}), 400

        raw_text = data['text']
        sos_type = data.get('type', 'MANUAL')
        victim_name = data.get('victim_name', 'Unknown')
        victim_age = data.get('victim_age', 'Unknown')

        # Safety override: If it's an AUTO/Man Down alert, skip LLM and mark RED instantly
        if sos_type == 'AUTO' or 'Man Down' in raw_text or 'unresponsive' in raw_text.lower():
            return jsonify({
                "priority": "RED",
                "reasoning": f"AUTOMATIC SENSOR ALERT: Man Down detected. Victim {victim_name} (Age: {victim_age}) is unresponsive after a severe fall.",
                "recommended_action": "Dispatch rescue team to target coordinates immediately with stretcher and neck brace."
            })

        # Construct Ollama payload without duplicating SYSTEM_PROMPT inside prompt
        ollama_payload = {
            "model": MODEL_NAME,
            "system": SYSTEM_PROMPT,
            "prompt": f"{FEW_SHOT_EXAMPLES}\nInput SOS: \"{raw_text}\"\nOutput:",
            "stream": False,
            "format": "json",
            "options": {
                "temperature": 0.1
            }
        }

        # Query Ollama with 60 second timeout for CPU inference
        response = requests.post(OLLAMA_API_URL, json=ollama_payload, timeout=60)
        
        if response.status_code != 200:
            return jsonify({
                "priority": "UNCLASSIFIED",
                "reasoning": f"Ollama returned error status code: {response.status_code}",
                "recommended_action": "Manual review required by Incident Commander."
            }), 200

        result_data = response.json()
        llm_response = result_data.get('response', '{}').strip()

        # Parse the JSON response from LLM
        parsed_response = json.loads(llm_response)
        
        # Validate keys in the parsed response
        required_keys = ["priority", "reasoning", "recommended_action"]
        if not all(key in parsed_response for key in required_keys):
            raise ValueError("LLM response JSON is missing required fields.")

        return jsonify(parsed_response)

    except requests.exceptions.Timeout:
        print("⚠️ Ollama request timed out (took >60s). Defaulting to UNCLASSIFIED.")
        return jsonify({
            "priority": "UNCLASSIFIED",
            "reasoning": "Local LLM inference timed out due to high load. Manual triage required.",
            "recommended_action": "Incident Commander must manually review victim symptoms."
        }), 200

    except json.JSONDecodeError as je:
        print(f"❌ JSON Decode Error from LLM response: {je}")
        return jsonify({
            "priority": "UNCLASSIFIED",
            "reasoning": "Failed to parse structured JSON from local LLM.",
            "recommended_action": "Manual review required by Incident Commander."
        }), 200

    except Exception as e:
        print(f"❌ Triage Service Error: {e}")
        return jsonify({
            "priority": "UNCLASSIFIED",
            "reasoning": f"Internal system error during classification: {str(e)}",
            "recommended_action": "Manual review required by Incident Commander."
        }), 200

if __name__ == '__main__':
    print("=" * 60)
    print("  🤖 Smart Triage AI Service running on http://localhost:8000")
    print(f"  Target LLM: {MODEL_NAME}")
    print("=" * 60)
    app.run(port=8000, host='0.0.0.0')
