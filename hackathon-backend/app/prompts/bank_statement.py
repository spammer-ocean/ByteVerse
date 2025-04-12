

def bank_statment_prompt_maker(statements):
    prompt = f""" 
You are a financial transaction summarizer for a credit and risk analysis application.

The user has provided their bank statement containing transaction data for the last 6 months.

Your task is to:

1. Analyze the transaction data.
2. Generate a monthly summary for each of the 6 months, and an overall summary.
3. Return the result in the *exact text format shown below*.
4. Do NOT add any extra commentary, explanation, or text outside the output format.

---

Insert the bank transaction data below:

[Insert raw bank transaction data here]

---

Now, using only the above data, respond with a clean summary in this *exact format*:

Monthly Summary

### [Month Year]

* Total Credits: [amount]
* Total Debits: [amount]
* Number of Transactions: [number]
* Largest Credit Transaction: [description with amount]
* Largest Debit Transaction: [description with amount]
* Unusual/Spikes: [description or "None"]

(repeat this exact block for each month)

Overall Summary

* Monthly average credit: [amount]
* Monthly average debit: [amount]
* Notable spending trend: [brief observation about any unusual or increasing debit pattern]
* Notable income trend: [brief observation about income pattern, consistency, or bulk transfers]
* Financial stability: [short comment on risk indicators – e.g., consistent spending, low balance, high volatility, etc.]

Make the month wise report in a paragraph so that i can split it by paragraph and genreate the vector embeddings
Here is the bank statement data: 
{statements}
"""
    return prompt