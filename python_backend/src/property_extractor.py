from typing import Dict, List, Optional
import re

def extract_property_details(text: str) -> Optional[Dict]:
    """
    Extracts property-related information from conversation text.
    
    Returns dictionary with details like:
    - Property type
    - Budget range
    - Location preferences
    - Required amenities
    - Size requirements
    """
    details = {}
    
    # Extract property type
    property_types = ["apartment", "flat", "house", "villa", "plot", "commercial"]
    for ptype in property_types:
        if ptype in text.lower():
            details["property_type"] = ptype
            break
            
    # Extract budget range using regex
    budget_pattern = r"(?:budget|price|cost|worth|value)[^\d]*(\d+(?:L|Cr|lakhs|crores|crore)?)"
    budget_match = re.search(budget_pattern, text, re.IGNORECASE)
    if budget_match:
        details["budget"] = budget_match.group(1)
        
    # Add more extraction logic for other details
    
    return details if details else None

def identify_follow_ups(text: str) -> List[str]:
    """
    Identifies required follow-up actions from conversation.
    
    Returns list of follow-up items like:
    - Schedule property visit
    - Send property documents
    - Confirm budget details
    - etc.
    """
    follow_ups = []
    
    # Keywords indicating follow-up needs
    follow_up_triggers = {
        r"(?:want|like|schedule).{0,30}(?:visit|see|tour)": "Schedule property visit",
        r"(?:send|share|email).{0,30}(?:documents?|papers|details)": "Send property documents",
        r"(?:call|contact|reach).{0,30}(?:back|later|tomorrow)": "Follow-up call required",
    }
    
    for pattern, action in follow_up_triggers.items():
        if re.search(pattern, text, re.IGNORECASE):
            follow_ups.append(action)
            
    return follow_ups
