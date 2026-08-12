import requests
import time
import random
import uuid
from datetime import datetime

# ── CONFIG ──────────────────────────────────────────────
BACKEND_URL = "http://localhost:5000/api/sos"
NODES_URL   = "http://localhost:5000/api/nodes"
INTERVAL_SECONDS = 15   # Send one SOS every 15 seconds to match local LLM processing speed
# ────────────────────────────────────────────────────────

# Realistic SOS messages — Manual (MANUAL) type
MANUAL_SOS_POOL = [
    # RED priority scenarios
    {"text": "My leg is crushed under a concrete slab, I can't move and I'm bleeding heavily. Please help!", "expected": "RED"},
    {"text": "I inhaled smoke, struggling to breathe, chest pain, feeling dizzy. Can't walk.", "expected": "RED"},
    {"text": "Trapped on third floor, building is collapsing. Severe head injury, blood everywhere.", "expected": "RED"},
    {"text": "Heart attack. Chest is crushing me. My left arm is numb. I'm 68 years old.", "expected": "RED"},
    {"text": "Drowning survivor. Not breathing properly. Lips are blue. Please come fast.", "expected": "RED"},

    # YELLOW priority scenarios
    {"text": "I have a broken arm and a gash on my forehead. I can walk but need medical attention.", "expected": "YELLOW"},
    {"text": "Twisted ankle badly, mild fever. I'm conscious and stable but stuck and need help.", "expected": "YELLOW"},
    {"text": "My daughter (8 yrs) has a high fever and vomiting. No serious injuries but very weak.", "expected": "YELLOW"},
    {"text": "Moderate burns on my left hand from fire. In pain but stable and breathing fine.", "expected": "YELLOW"},
    {"text": "Back injury from debris, can't stand up straight but fully conscious. Need medical help.", "expected": "YELLOW"},

    # GREEN priority scenarios
    {"text": "Minor cuts and bruises. Shaken but okay. Just need water and a safe place.", "expected": "GREEN"},
    {"text": "Small cut on my knee. A bit scared. Overall fine, just need bandage.", "expected": "GREEN"},
    {"text": "I'm safe on the rooftop. No injuries. Just need rescue to come get me.", "expected": "GREEN"},
    {"text": "Elderly woman, 75. No injuries but very tired and dehydrated. Needs water and rest.", "expected": "GREEN"},
    {"text": "Sprained wrist, minor bruising. Fully mobile, can wait for rescue.", "expected": "GREEN"},
]

# Realistic victim data
VICTIM_NAMES = [
    "Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Reddy",
    "Mohammed Yusuf", "Anjali Singh", "Vikram Nair", "Sunita Devi",
    "Kiran Joshi", "Arjun Mehta", "Lakshmi Rao", "Deepak Gupta"
]

LOCATIONS = [
    "Near collapsed bridge, sector 4",
    "3rd floor, Apartment Block B",
    "Open field, north of highway",
    "Under debris, old market area",
    "Rooftop of community center",
    "Near riverbank, south zone",
    "Inside damaged school building",
    "Behind the railway station"
]

NODE_IDS = ["node_01", "node_02", "node_03"]

# Simulated battery levels (starts high, drains over time)
node_battery = {"node_01": 95, "node_02": 88, "node_03": 72}
node_rssi    = {"node_01": -45, "node_02": -62, "node_03": -78}
seq_counter  = 1


def generate_heartbeat():
    """Simulate node battery drain and send heartbeat"""
    global node_battery
    for node_id in NODE_IDS:
        # Drain battery slowly
        node_battery[node_id] = max(5, node_battery[node_id] - random.uniform(0.2, 0.8))
        # Slight RSSI fluctuation
        node_rssi[node_id] = node_rssi[node_id] + random.randint(-3, 3)

        try:
            requests.patch(
                f"http://localhost:5000/api/nodes/{node_id}/heartbeat",
                json={
                    "batteryPercent": round(node_battery[node_id], 1),
                    "rssi": node_rssi[node_id],
                    "snr": round(random.uniform(6.0, 12.0), 1),
                },
                timeout=3
            )
        except Exception:
            pass  # Node heartbeat endpoint is optional in early dev


def send_manual_sos():
    """Send a simulated manual SOS (victim filled the portal form)"""
    sos_data   = random.choice(MANUAL_SOS_POOL)
    node_id    = random.choice(NODE_IDS)
    victim_name = random.choice(VICTIM_NAMES)
    unique_seq = f"SEQ_{uuid.uuid4().hex[:6].upper()}"

    payload = {
        "seqId":           unique_seq,
        "name":            victim_name,
        "age":             random.randint(8, 80),
        "locationContext": random.choice(LOCATIONS),
        "nodeId":          node_id,
        "rawText":         sos_data["text"],
        "type":            "MANUAL",
        "hops":            random.randint(1, 3),
        "rssi":            node_rssi[node_id],
    }

    try:
        response = requests.post(BACKEND_URL, json=payload, timeout=10)
        if response.status_code == 201:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ MANUAL SOS sent | "
                  f"Node: {node_id} | Victim: {victim_name} | "
                  f"Expected: {sos_data['expected']} | Seq: {unique_seq}")
        else:
            print(f"❌ Failed: {response.status_code} — {response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Is the server running on port 5000?")
    except Exception as e:
        print(f"❌ Error: {e}")


def send_auto_sos():
    """Send a simulated AUTO SOS — Man Down detected by sensor"""
    node_id     = random.choice(NODE_IDS)
    victim_name = random.choice(VICTIM_NAMES)
    unique_seq  = f"SEQ_{uuid.uuid4().hex[:6].upper()}"

    payload = {
        "seqId":           unique_seq,
        "name":            victim_name,
        "age":             random.randint(20, 70),
        "locationContext": random.choice(LOCATIONS),
        "nodeId":          node_id,
        "rawText":         "AUTOMATIC ALERT: Man Down event detected by motion sensor. "
                           "Victim is unresponsive. Possible fall or loss of consciousness.",
        "type":            "AUTO",
        "hops":            random.randint(1, 2),
        "rssi":            node_rssi[node_id],
    }

    try:
        response = requests.post(BACKEND_URL, json=payload, timeout=10)
        if response.status_code == 201:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] ⚠️  AUTO SOS (MAN DOWN) | "
                  f"Node: {node_id} | Victim: {victim_name} | Seq: {unique_seq}")
        else:
            print(f"❌ Failed: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Is the server running on port 5000?")


def main():
    print("=" * 60)
    print("  🚑 Smart Triage & Rescue Grid — Mock SOS Generator")
    print(f"  Sending SOS every {INTERVAL_SECONDS} seconds")
    print(f"  Backend: {BACKEND_URL}")
    print("  Press Ctrl+C to stop")
    print("=" * 60)

    auto_sos_interval = 4   # Send 1 AUTO SOS every 4 regular ones

    for i in range(1, 1000):
        generate_heartbeat()

        if i % auto_sos_interval == 0:
            send_auto_sos()
        else:
            send_manual_sos()

        time.sleep(INTERVAL_SECONDS)


if __name__ == "__main__":
    main()
