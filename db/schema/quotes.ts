import { pgTable, uuid, varchar, text, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const quoteTypeEnum = pgEnum("quote_type", [
  "life",
  "term",
  "annuity",
]);

export const quotes = pgTable("quotes", {
  id: uuid("id").defaultRandom().primaryKey(),
  quoteNumber: varchar("quote_number", { length: 50 }).unique(),
  type: quoteTypeEnum("type").notNull(),
  agentId: uuid("agent_id").references(() => users.id).notNull(),
  clientData: jsonb("client_data").notNull(), // Store client information as JSON
  carrier: varchar("carrier", { length: 100 }),
  product: varchar("product", { length: 200 }),
  faceAmount: text("face_amount"),
  premium: text("premium"),
  pdfUrl: text("pdf_url"), // URL to generated PDF in Supabase Storage
  externalQuoteId: varchar("external_quote_id", { length: 255 }), // ID from external system (WinFlex, iPipeline, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const quotesRelations = relations(quotes, ({ one }) => ({
  agent: one(users, {
    fields: [quotes.agentId],
    references: [users.id],
  }),
}));

