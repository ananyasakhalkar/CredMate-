import json
from fastapi import FastAPI, HTTPException
import requests
import pandas as pd

app = FastAPI()

# Load decision tree with structured logic and FAQs
decision_tree = {
    "question": "How can I help you with your loan application?",
    "options": {
        "I want to apply for a loan": {
            "question": "What is your employment type?",
            "options": {
                "Salaried": {
                    "question": "What is your monthly income?",
                    "action": "Call Loan Eligibility API"
                },
                "Self-Employed": {
                    "question": "Do you have business proof (ITR, GST filings)?",
                    "conditions": {
                        "Yes": "Proceed to Required Documents",
                        "No": "Show rejection reason"
                    }
                }
            }
        },
        "Loan Eligibility & Decisioning": {
            "question": "Do you want to check if you are eligible for a loan?",
            "action": "Call Loan Eligibility API"
        },
        "Loan Terms & Repayment": {
            "question": "Do you want details on loan terms and repayment?",
            "options": {
                "Interest Rates": {"answer": "We offer fixed and floating rates based on your profile."},
                "EMI Calculation": {"answer": "Use our EMI calculator to estimate your monthly payments."},
                "Loan Repayment": {
                    "question": "Do you want to set up auto-debit for EMI payments?",
                    "options": {
                        "Yes": "Register auto-pay",
                        "No": "Explain manual payment methods"
                    },
                    "next": {
                        "question": "Can I prepay my loan early?",
                        "conditions": {
                            "Allowed": "Explain prepayment process",
                            "Penalty": "Explain charges"
                        }
                    }
                }
            }
        },
        "Loan FAQs": {
            "question": "Choose a topic you need help with:",
            "options": {}
        }
    }
}

# Load FAQ dataset
df = pd.read_csv("faqs.csv")
faq_dict = {row["Question"]: row["Answer"] for _, row in df.iterrows()}
decision_tree["options"]["Loan FAQs"]["options"] = {q: {"answer": a} for q, a in faq_dict.items()}

@app.get("/chat")
def chat(option: str, path: str = "", income: int = 0, cibil_score: int = 0, loan_amount: int = 0):
    """Handles chatbot interaction based on user choice."""
    node = decision_tree
    if path:
        for step in path.split("/"):
            node = node["options"].get(step, {})
            if not node:
                raise HTTPException(status_code=400, detail="Invalid path")

    next_node = node["options"].get(option, {})

    # Call Loan Eligibility Model from loan_api.py
    if option == "Loan Eligibility & Decisioning":
        payload = {
            "age": 30,  # You can ask this from the user dynamically
            "income": income,
            "purpose": "home",
            "cibil_score": cibil_score,
            "past_repayment_history": "clean",
            "employment_type": "salaried",
            "monthly_debts": 5000,
            "loan_amount": loan_amount,
            "loan_tenure": 10,
            "collateral_provided": True,
            "co_applicant": False
        }
        try:
            model_response = requests.post("http://127.0.0.1:8000/evaluate_loan", json=payload).json()
            return model_response
        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=500, detail="Error connecting to loan_api service")

    if "question" in next_node:
        return {"question": next_node["question"], "options": list(next_node.get("options", {}).keys())}

    return {"response": next_node}

@app.get("/start")
def start():
    """Start the chatbot with the first question."""
    return {"question": decision_tree["question"], "options": list(decision_tree["options"].keys())}
