# A GPT-based Code Review System with Accurate Feedback for Programming Education

This repository contains the source code for the **GPT-based code review system** developed to support **programming education**. The system is designed to automatically evaluate code correctness and provide constructive feedback using large language models (LLMs), such as GPT.

## 📌 Abstract

This project proposes a GPT-based code review system to assist students in learning programming more effectively. The system introduces two key components: the **Code Review Module(CCM)** and the **Code Correctness Check Module(CRM)**.

- **CRM**: enhances the feedback process by first determining whether a review is necessary through the Review Necessity Chain (RNC). If required, the system proceeds to the Strict Code Check Chain (SCC), which performs deeper analysis even after test cases pass. It detects subtle issues such as unnecessary code, unmet requirements, hard coding, and computation errors. This layered approach ensures that only meaningful and accurate feedback is generated, minimizing unnecessary reviews and improving efficiency.
![CRM](https://codetutorbot.blob.core.windows.net/image/CRM.png)
  
- **CCM**: is designed to go beyond simple test case validation by enabling stricter verification of code quality. It uses a collaborative validation flow that integrates both compilation and answer checking to detect issues that mechanical validation alone cannot identify. The Answer Check Component (ACC) focuses on evaluating incorrect outputs, syntax errors, and code complexity using server-side resources. If the code passes all test cases, the Strict Code Check Chain (SCC) performs an additional layer of analysis. SCC examines the code for unnecessary content, violations of problem constraints, hard-coded outputs, and computational errors. If no issues are found, the system returns a message indicating that the code is clean and stops the evaluation.
![CCM](https://codetutorbot.blob.core.windows.net/image/CCM.png)

## 🎯 Key Features

- ✅ Review necessity detection using LLMs
- ✅ Multi-level code correctness checks beyond test case validation
- ✅ Educational feedback generation tailored to students
- ✅ Cost-efficient API usage with GPT-4
- ✅ Usability tested with elementary and secondary students

## 🛠️ Technologies Used
- **Typescript**
- **Next.js**
- **OpenAI GPT (via API)**
- **LangChain** for prompt chaining
- **MongoDB** for data logging
- **Azure** (for deployment)

## 🗂️ System Modules

```text
.
├── api/                        
├──── codeFeedback/route.ts     # CRM (Review Necessity Chain & Review Comment Generation Chain)
├──── codeExecution/route.ts    # Code Correctness Check Module (Answer Check Component)
├──── codeRigidCheck/route.ts   # Code Correctness Check Module (Strict Code Check Chain)
```

## ▶️ To install packages:

```bash
npm install
```

## ▶️ To run:

```bash
npm run dev
```

📬 **Contact**  
ehdrb3663@hanyang.ac.kr
