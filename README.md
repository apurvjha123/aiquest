
# 📖 AIQuest

### Aiquest is an npm package that streamlines the process of parsing websites, splitting content into manageable chunks, embedding these chunks into machine-friendly vectors, and subsequently storing and retrieving these embeddings from AWS. This documentation outlines its design and possibilities. Rag

### 🚀 Table of Contents
- 🔧 [Design](#-Design)
- 🔍 [Installation](#-Installation)
- 🛠️ [Usage](#%EF%B8%8F-Usage)
    - 🕸️ [Parsing](#%EF%B8%8F-Parsing)
    - ✂️ [Chunking](#%EF%B8%8F-Chunking)
    - 🧬 [Embedding](#-Embedding)
    - ☁️ [Storing on AWS](#%EF%B8%8F-Storing-on-AWS)
    - 🔎 [Retrieval](#-Retrieval)
- 📝 [Examples](#-Examples)
- 🌟 [Future Enhancements](#-Future-Enhancements)
- 🤝 [Contribution](#-Contribution)
- 🐛 [Bug Reporting](#-Bug-Reporting)

## 🔧 Design
#### rag-aiquest integrates several utilities under one package:

**UnifiedParser**: For parsing content from URLs.

**ChunkUtility**: To split the parsed content into chunks.

**EmbeddingUtility**: Utilizes the OpenAI API to embed the chunks into vectors.

**VectorStoreAWS**: A utility for AWS operations related to embedding storage.

**Retrival**: Provides functionality to retrieve knowledge and run QnA.
   

## 🔍 Installation

```javascript
npm install rag-aiquest
```

## 🛠️ Usage

### 🕸️ Parsing

***Use the UnifiedParser to parse content from a URL.***

```javascript
const parser = new UnifiedParser();
const parsedValue = await parser.parse('YOUR_URL_HERE');
```

### ✂️ Chunking

***To split the parsed content into chunks:***

```javascript
const chunks = ChunkUtility.splitIntoChunks(parsedValue, chunkSize, overlapSize);
```

### 🧬 Embedding

***Embed chunks using OpenAI API.***

```javascript
const embedding = new EmbeddingUtility('YOUR_OPENAI_API_KEY');
const embedded = await embedding.createEmbedding(chunks);
```

### ☁️ Storing on AWS

***To upload the embedded model to AWS:***

```javascript
const aws = new VectorStoreAWS(AWS_ACCESS_KEY_ID, AWS_ACCESS_SECRET, AWS_BUCKET_NAME);
await aws.uploadEmbededModeltoAWS(embedded, 'YOUR_FILE_NAME');
```

### 🔎 Retrieval
***To retrieve and query the knowledge:***

```javascript
const knowledge = await aws.getKnowledgeData('YOUR_FILE_NAME');
const retrive = new Retrival('YOUR_OPENAI_API_KEY');
const search = await retrive.QnARetrival(knowledge, 'YOUR_QUERY');
console.log(search.choices[0].message);
```

## 📝 Examples
**As given in the provided code, you can easily integrate the utilities to parse, chunk, embed, store, and retrieve knowledge.**

## 🌟 Future Enhancements
***Compression***: Improve storage efficiency by compressing embedded vectors.

***Batch Processing***: Enhance the library to handle batch processing of URLs.

***Support for More Embeddings***: Plan to add support for other embedding APIs.

## 🤝 Contribution
If you wish to contribute to rag-aiquest, please refer to the CONTRIBUTING.md file.

## 🐛 Bug Reporting

Feel free to [open an issue](https://github.com/apurvjha123/aiquest) on GitHub if you find any bug.

<a id="feature-request"></a>

## ⭐ Feature Request

- Feel free to [Open an issue](https://github.com/apurvjha123/aiquest) on GitHub to request any additional features you might need for your use case.
- Connect with me on [LinkedIn](https://www.linkedin.com/in/apurv-jha-7367b1236/). I'd love ❤️️ to hear where you are using this library.

<a id="release-notes"></a>

## 📋 Release Notes

Check [here](https://github.com/apurvjha123/aiquest/releases) for release notes.
