import { Template } from "./types";

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "startup",
    name: "Startup / Tech",
    subject: "Building the future at [CompanyName]",
    bodyHTML: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 0;">
      <!-- IMAGE_NOTE: Use absolute URL for banner (e.g., https://res.cloudinary.com/dswzqgdf3/image/upload/v1775910268/Banner_js0fuy.png) -->
      <img src="https://res.cloudinary.com/dswzqgdf3/image/upload/v1775910268/Banner_js0fuy.png" alt="Rapsora Banner" style="width: 100%; height: auto; display: block;" />
      
      <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 0 0 24px 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.04); border: 1px solid #f1f1f1; border-top: none;">
        
        <!-- Premium Header Restore -->
        <div style="padding: 20px 40px; text-align: left; border-bottom: 1px solid #f8f8f8; margin-bottom: 20px;">
        </div>

        <div style="padding: 0 20px 20px;">
          <h1 style="font-size: 32px; font-weight: 800; color: #000; letter-spacing: -1px; line-height: 1.1; margin-bottom: 24px;">
            Hi [Name],<br>Your vision for [CompanyName] is inspiring.
          </h1>

          <p style="font-size: 17px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; font-weight: 400;">
            We've been tracking <strong>[CompanyName]</strong> and the impact you're making. As you scale, the technical complexity often grows faster than the roadmap allows.
          </p>

          <p style="font-size: 17px; line-height: 1.6; color: #4b5563; margin-bottom: 32px;">
            At <strong>Rapsora</strong>, we specialize in high-velocity engineering for teams that can't afford to slow down. We build the systems that turn scaling challenges into competitive advantages.
          </p>

          <div style="background-color: #f3f4f6; border-radius: 20px; padding: 24px; margin-bottom: 32px;">
            <p style="margin: 0 0 16px; font-size: 13px; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 1px;">Capabilities Protocol:</p>
            <table style="width: 100%;">
              <tr>
                <td style="padding-bottom: 8px; font-size: 15px; color: #374151;">• Rapid Prototype Acceleration</td>
              </tr>
              <tr>
                <td style="padding-bottom: 8px; font-size: 15px; color: #374151;">• Enterprise-Grade Infrastructure</td>
              </tr>
              <tr>
                <td style="font-size: 15px; color: #374151;">• Intelligent Automation Engines</td>
              </tr>
            </table>
          </div>

          <div style="margin-bottom: 40px;">
            <a href="https://rapsora.com" style="display: inline-block; background-color: #000; color: #fff; padding: 18px 32px; border-radius: 16px; font-size: 16px; font-weight: 700; text-decoration: none; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
              View Our Intelligence
            </a>
          </div>

          <div style="border-top: 1px solid #f1f1f1; pt-32; margin-top: 40px; padding-top: 32px;">
            <p style="margin: 0; font-size: 16px; font-weight: 700; color: #000;">Vasu</p>
            <p style="margin: 4px 0 0; font-size: 14px; color: #6b7280;">Lead Architect, RapSora Technologies pvt. ltd.</p>
          </div>
        </div>

        <!-- Minimal Footer -->
        <div style="background-color: #fafafa; padding: 32px 40px; text-align: center; border-top: 1px solid #f1f1f1;">
          <p style="margin: 0; font-size: 12px; color: #9ca3af; font-weight: 500; letter-spacing: 0.5px;">
            WWW.RAPSORA.COM &nbsp;•&nbsp; +91 8858743254
          </p>
        </div>
      </div>
    </div>
    `
  },
  {
    id: "premium",
    name: "Premium / Executive",
    subject: "Strategic evolution for [CompanyName]",
    bodyHTML: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif; background-color: #ffffff; padding: 0;">
      <img src="https://res.cloudinary.com/dswzqgdf3/image/upload/v1775910268/Banner_js0fuy.png" alt="Rapsora Banner" style="width: 100%; height: auto; display: block;" />

      <div style="max-width: 520px; margin: 0 auto; padding: 40px 20px;">
        <div style="margin-bottom: 60px; border-bottom: 1px solid #f1f1f1; padding-bottom: 20px;">
           <span style="font-size: 12px; font-weight: 900; letter-spacing: 3px; color: #000; text-transform: uppercase;">RAPSORA</span>
        </div>

        <h1 style="font-size: 42px; font-weight: 800; color: #000; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 40px;">
          The next tier<br>of [CompanyName].
        </h1>

        <p style="font-size: 20px; line-height: 1.5; color: #000; margin-bottom: 30px; font-weight: 500;">
          Hi [Name], excellence is moving fast.
        </p>

        <p style="font-size: 18px; line-height: 1.7; color: #666; margin-bottom: 40px;">
          Most organizations build for today. We build for the version of <strong>[CompanyName]</strong> that doesn't exist yet—the one that dominates your sector through superior digital infrastructure.
        </p>

        <div style="margin-bottom: 60px;">
          <a href="https://rapsora.com" style="display: inline-block; border: 2px solid #000; color: #000; padding: 16px 40px; font-size: 14px; font-weight: 900; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; transition: all 0.3s ease;">
            Request Case Dossier
          </a>
        </div>

        <div style="border-left: 2px solid #f1f1f1; padding-left: 30px; margin-top: 60px;">
          <p style="margin: 0; font-size: 16px; font-weight: 700; color: #000;">Strategic Partnerships</p>
          <p style="margin: 4px 0 0; font-size: 14px; color: #999;">Rapsora Global Intelligence</p>
        </div>
      </div>
    </div>
    `
  },
  {
    id: "modern",
    name: "Modern / Minimal",
    subject: "Idea for [CompanyName]",
    bodyHTML: `
    <div style="font-family: -apple-system, sans-serif; background-color: #000; padding: 0; text-align: center;">
      <img src="https://res.cloudinary.com/dswzqgdf3/image/upload/v1775910268/Banner_js0fuy.png" alt="Rapsora Banner" style="width: 100%; height: auto; display: block;" />

      <div style="max-width: 480px; margin: 40px auto; background-color: #111; border-radius: 32px; padding: 48px; border: 1px solid #222;">
        
        <div style="width: 48px; height: 48px; border: 2px solid #fff; border-radius: 16px; margin: 0 auto 40px; display: flex; align-items: center; justify-content: center;">
           <span style="color: #fff; font-weight: 900;">R</span>
        </div>

        <h2 style="font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 24px; letter-spacing: -0.5px;">
          [Name] + Rapsora
        </h2>

        <p style="font-size: 16px; line-height: 1.6; color: #888; margin-bottom: 32px;">
          [CompanyName] is doing something unique. We have a hypothesis on how to accelerate your current trajectory by 2.4x using our proprietary deployment edge.
        </p>

        <a href="https://rapsora.com" style="display: block; background-color: #fff; color: #000; padding: 20px; border-radius: 20px; font-size: 16px; font-weight: 800; text-decoration: none;">
          Unlock Growth Path
        </a>

        <p style="margin-top: 40px; font-size: 12px; color: #444; text-transform: uppercase; letter-spacing: 2px;">
          Transmission Secure • 2026
        </p>
      </div>
    </div>
    `
  }
];

export function replaceVariables(template: string, data: { name: string; company: string }) {
  const result = template
    .replace(/\[Name\]/g, data.name || "[Name]")
    .replace(/\[CompanyName\]/g, data.company || "[CompanyName]");
  return result;
}
