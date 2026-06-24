# AI Interview Intelligence Platform

An AI-powered interview preparation platform that analyzes candidate resumes and job descriptions, identifies skill gaps, and delivers personalized learning recommendations using Retrieval-Augmented Generation (RAG), semantic search, and Large Language Models.

---

## Overview

The platform helps candidates prepare for technical interviews by:

* Extracting skills from resumes
* Analyzing job descriptions
* Identifying skill gaps
* Recommending personalized learning resources
* Building a structured candidate profile
* Generating AI-driven interview preparation workflows

---

## Architecture

Resume PDF
→ Resume Parsing
→ Semantic Skill Matching
→ Gemini Verification
→ Candidate Profile

Job Description
→ JD Parsing
→ Skill Extraction

Candidate Skills + JD Skills
→ Skill Gap Analysis

Skill Gaps
→ Embedding Generation
→ Qdrant Vector Database
→ Semantic Resource Retrieval

Retrieved Resources
→ Personalized Learning Recommendations

---

## Features

### Authentication & User Management

* JWT-based Authentication
* Secure Password Hashing
* Protected API Routes
* User Profile Management

### Resume Intelligence

* PDF Resume Upload
* Resume Parsing
* Gemini-powered Skill Extraction
* Structured Candidate Profile Generation

### Job Description Intelligence

* JD Upload & Parsing
* Skill Extraction
* Skill Normalization
* Automated Skill Gap Analysis

### RAG Recommendation Engine

* Embedding Generation
* Qdrant Vector Database Integration
* Semantic Search
* Personalized Learning Resource Recommendations

### Candidate Profiling

* Skill Categorization
* Experience Mapping
* Gap Identification
* Preparation Planning

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### AI & LLM

* Google Gemini API
* Embeddings

### Vector Database

* Qdrant

### Authentication

* JWT (JSON Web Tokens)
* bcrypt

---

## Project Status

### Completed

* Authentication Module
* Resume Analysis Pipeline
* Job Description Analysis Pipeline
* Candidate Profile Generation
* Skill Gap Analysis Engine
* Embedding Generation Pipeline
* Qdrant Integration
* Semantic Resource Retrieval
* Recommendation Engine

### Currently Under Development

* AI Interview Generation Engine
* Answer Evaluation Framework
* Personalized Progress Tracking
* Analytics Dashboard
* Agentic AI Features

---

## Future Enhancements

* Adaptive Interview Sessions
* Personalized Learning Paths
* Interview Performance Analytics
* Multi-Agent Interview Workflows
* Automated Weak-Skill Reinforcement
* Mock Interview Simulator

---

## Learning Outcomes

Through this project, I explored:

* Retrieval-Augmented Generation (RAG)
* Vector Databases
* Embedding-based Semantic Search
* LLM Integration
* Backend API Design
* AI System Architecture
* Candidate Skill Intelligence Pipelines
* Personalized Recommendation Systems

---

## Key Engineering Decisions

- Used Embedding-based Semantic Matching to improve skill extraction accuracy over traditional regex approaches.
- Leveraged Qdrant Vector Database for efficient semantic retrieval using cosine similarity.
- Implemented Retrieval-Augmented Generation (RAG) to provide grounded learning recommendations and reduce LLM hallucinations.
- Stored processed resume and job-description intelligence in MongoDB to reduce repeated LLM calls, lowering cost and latency.

---

## Author

Akshith Kumar Sakinala

B.Tech CSE (AI & ML) | VNR VJIET
