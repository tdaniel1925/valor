import { NextResponse } from "next/server"

// OpenAPI 3.0 specification
const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Valor Insurance Platform API",
    version: "1.0.0",
    description: "API documentation for Valor Insurance Platform",
    contact: {
      name: "API Support",
      email: "support@valorfinancial.com",
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3006",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Case: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          caseNumber: { type: "string" },
          type: {
            type: "string",
            enum: ["life", "term", "annuity", "other"],
          },
          status: {
            type: "string",
            enum: [
              "draft",
              "submitted",
              "under_review",
              "approved",
              "rejected",
              "pending_requirements",
              "issued",
            ],
          },
          agentId: { type: "string", format: "uuid" },
          clientInfo: { type: "object" },
          carrier: { type: "string" },
          product: { type: "string" },
          faceAmount: { type: "string" },
          premium: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CaseInput: {
        type: "object",
        required: ["type", "status"],
        properties: {
          type: {
            type: "string",
            enum: ["life", "term", "annuity", "other"],
          },
          status: {
            type: "string",
            enum: [
              "draft",
              "submitted",
              "under_review",
              "approved",
              "rejected",
              "pending_requirements",
              "issued",
            ],
          },
          clientInfo: { type: "object" },
          carrier: { type: "string" },
          product: { type: "string" },
          faceAmount: { type: "string" },
          premium: { type: "string" },
        },
      },
      Quote: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          quoteNumber: { type: "string" },
          type: {
            type: "string",
            enum: ["life", "term", "annuity"],
          },
          agentId: { type: "string", format: "uuid" },
          carrier: { type: "string" },
          product: { type: "string" },
          faceAmount: { type: "string" },
          premium: { type: "string" },
          clientData: { type: "object" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      QuoteInput: {
        type: "object",
        required: ["type"],
        properties: {
          type: {
            type: "string",
            enum: ["life", "term", "annuity"],
          },
          carrier: { type: "string" },
          product: { type: "string" },
          faceAmount: { type: "string" },
          premium: { type: "string" },
          clientData: { type: "object" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              message: { type: "string" },
              code: { type: "string" },
            },
          },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        summary: "Health check",
        description: "Check application health status",
        tags: ["Health"],
        responses: {
          "200": {
            description: "Application is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    timestamp: { type: "string", format: "date-time" },
                    services: {
                      type: "object",
                      properties: {
                        database: { type: "string" },
                        supabase: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/cases": {
      get: {
        summary: "Get all cases",
        description: "Retrieve all cases for the authenticated user",
        tags: ["Cases"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "pageSize",
            in: "query",
            schema: { type: "integer", default: 20 },
          },
          {
            name: "status",
            in: "query",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "List of cases",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Case" },
                    },
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
      post: {
        summary: "Create a case",
        description: "Create a new insurance case",
        tags: ["Cases"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CaseInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Case created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/Case" },
                  },
                },
              },
            },
          },
          "400": { description: "Bad request" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/quotes": {
      get: {
        summary: "Get all quotes",
        description: "Retrieve all quotes for the authenticated user",
        tags: ["Quotes"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "List of quotes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Quote" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a quote",
        description: "Create a new insurance quote",
        tags: ["Quotes"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/QuoteInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Quote created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/Quote" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

}
export async function GET() {
  return NextResponse.json(openApiSpec)
}

