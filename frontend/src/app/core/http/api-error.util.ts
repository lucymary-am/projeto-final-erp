import { HttpErrorResponse } from '@angular/common/http';

type ValidationIssue = {
  path?: Array<string | number>;
  message?: string;
};

export type ParsedApiError = {
  message: string;
  validationErrors: string[];
};

export function parseApiError(error: unknown, fallbackMessage: string): ParsedApiError {
  if (!(error instanceof HttpErrorResponse)) {
    return { message: fallbackMessage, validationErrors: [] };
  }

  const apiMessage = extractApiMessage(error);
  const validationErrors = error.status === 422 ? extractValidationErrors(error.error) : [];

  return {
    message: apiMessage ?? fallbackMessage,
    validationErrors
  };
}

function extractApiMessage(error: HttpErrorResponse): string | null {
  const body = error.error;
  if (body && typeof body === 'object' && typeof body.message === 'string' && body.message.length > 0) {
    return body.message;
  }

  if (typeof error.message === 'string' && error.message.length > 0) {
    return error.message;
  }

  return null;
}

function extractValidationErrors(payload: unknown): string[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const data = payload as { errors?: unknown };
  if (!Array.isArray(data.errors)) {
    return [];
  }

  return data.errors
    .map((issue: unknown) => toValidationMessage(issue as ValidationIssue))
    .filter((message: string | null): message is string => Boolean(message));
}

function toValidationMessage(issue: ValidationIssue): string | null {
  const message = issue.message?.trim();
  if (!message) {
    return null;
  }
  return message;
}
