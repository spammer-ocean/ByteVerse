def chat_prompt_maker(bank_summary, ais_summary, user_query,credix_score,conversation_memory):
    print("this is fucking convo",conversation_memory)
    prompt = f""" 
You are an expert credit risk analyst with deep experience in assessing loan applications for financial institutions. Analyze the applicant's financial health and creditworthiness based on the following structured data sources:

1. Annual Information Statement (AIS) Summary
2. Bank Statement Summary
3. Multi-Bureau Aggregated API Data (excluding the normalized credit score)

Your task:
- Conduct a comprehensive evaluation of the applicant’s credit risk profile.
- Recommend a clear and actionable lending decision (Approve / Decline / Approve with Conditions).
- Suggest appropriate lending terms (Maximum Loan Amount, Interest Rate Range, Tenure, Collateral Requirement).
- Provide risk mitigation strategies, if any risks are identified.

Be objective, data-driven, and concise in your analysis. Avoid any assumptions not supported by the provided data.

---

### Data Inputs:

**AIS Summary:**
{ais_summary}
---

**Bank Statement Summary:**
{bank_summary}
---
**Here is the credit score we calculated based on the different information**
{credix_score}
---

### Here is the past conversation memory
{conversation_memory}

user can ask something based on your chat history so ask the user based on that too

### User Query:
{user_query}



"""

    return prompt
