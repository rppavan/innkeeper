import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { google } from '@ai-sdk/google';

export const myProvider = customProvider({
  languageModels: {
    'chat-model': google('gemini-2.5-flash'),
    'chat-model-reasoning': wrapLanguageModel({
      model: google('gemini-2.5-pro'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': google('gemini-2.5-flash'),
    'artifact-model': google('gemini-2.5-flash'),
  },
  imageModels: {
    'small-model': google.imageModel('imagen-4.0-generate-preview-06-06'),
  },
});
