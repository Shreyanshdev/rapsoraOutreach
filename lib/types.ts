export interface Lead {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  company: string;
  industry: Industry;
  createdAt: any;
}

export type Industry = "School" | "Startup";

export interface Template {
  id: string;
  name: string;
  subject: string;
  bodyHTML: string;
}

export const INDUSTRIES: Industry[] = ["School", "Startup"];
