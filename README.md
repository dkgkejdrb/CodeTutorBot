# A GPT-based Code Review System with Accurate Feedback for Programming Education

This repository contains the source code for the **GPT-based code review system** developed to support **programming education**. The system is designed to automatically evaluate code correctness and provide constructive feedback using large language models (LLMs), such as GPT.

## 📌 Abstract

This project proposes a GPT-based code review system to assist students in learning programming more effectively. The system introduces two key components: the **Code Review Module(CCM)** and the **Code Correctness Check Module(CRM)**.

- **CRM**: enhances the feedback process by first determining whether a review is necessary through the Review Necessity Chain (RNC). If required, the system proceeds to the Strict Code Check Chain (SCC), which performs deeper analysis even after test cases pass. It detects subtle issues such as unnecessary code, unmet requirements, hard coding, and computation errors. This layered approach ensures that only meaningful and accurate feedback is generated, minimizing unnecessary reviews and improving efficiency.
![CRM](https://codetutorbot.blob.core.windows.net/image/2-2.png)
  
- **CRM**: to rduce unnecessary token usage and associated costs, the system introduces the Review Necessity Chain (RNC), which filters out overly simple or meaningless code that does not warrant a review, such as print() or basic input statements. The RNC assesses whether a review is needed by analyzing the correctness and relevance of the submission. If a review is required, the Review Generation Chain (RGC) then produces feedback by highlighting problematic lines and providing appropriate comments..
![CCM](https://codetutorbot.blob.core.windows.net/image/2-3.png)

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
