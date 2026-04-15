import { Template } from "./types";

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "startup",
    name: "Startup / Tech",
    subject: "Scaling [CompanyName]: Technical Excellence for Founders",
    bodyHTML: `
<div style="font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0f; padding: 0; margin: 0;">

  <img src="https://res.cloudinary.com/dswzqgdf3/image/upload/v1775910268/Banner_js0fuy.png" alt="Rapsora Banner" style="width: 100%; height: auto; display: block;" />

  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #11111a 0%, #1a103d 100%); text-align: center; padding: 60px 40px 50px; border-left: 1px solid #222; border-right: 1px solid #222;">
    <h1 style="font-size: 38px; font-weight: 800; color: #ffffff; line-height: 1.1; margin: 0 0 15px; letter-spacing: -1px;">
      Build at the Speed<br/>of Thought.
    </h1>
    <p style="font-size: 14px; color: #a78bfa; font-weight: 600; margin: 0 0 25px; letter-spacing: 2px; text-transform: uppercase;">
      Fractional Engineering for [CompanyName]
    </p>
    <p style="font-size: 16px; line-height: 1.6; color: #94a3b8; margin: 0; max-width: 480px; display: inline-block;">
      You focus on the vision and the market. We build the indestructible technical engine that powers your growth. Zero compromise.
    </p>
  </div>

  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 0 0 24px 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">

    <div style="padding: 40px 35px 30px;">
      <h2 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 18px;">Hey [Name],</h2>
      <p style="font-size: 16px; line-height: 1.8; color: #334155; margin: 0 0 16px;">
        Founders at <strong>[CompanyName]</strong> shouldn't be spending 40% of their time managing bug reports or fighting legacy code. You should be talking to users.
      </p>
      <p style="font-size: 16px; line-height: 1.8; color: #334155; margin: 0;">
        At <strong>Rapsora</strong>, we act as your fractional engineering arm. We don't just write code; we build scalable architecture that survives your next 10x growth spurt.
      </p>
    </div>

    <div style="background: #f8fafc; padding: 35px; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
      <p style="font-size: 13px; font-weight: 700; color: #7c3aed; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 25px; text-align: center;">The Rapsora Engineering Edge</p>
      
      <table width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="width: 50%; padding: 10px; vertical-align: top;">
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;">
              <div style="font-size: 32px; margin-bottom: 12px;">🚀</div>
              <p style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 6px;">MVP Velocity</p>
              <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">Ship your core product in weeks, not months. Battle-tested stacks only.</p>
            </div>
          </td>
          <td style="width: 50%; padding: 10px; vertical-align: top;">
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;">
              <div style="font-size: 32px; margin-bottom: 12px;">🏗️</div>
              <p style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 6px;">Scale Shield</p>
              <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">Cloud-native architecture designed to handle sudden traffic spikes without a sweat.</p>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <div style="background: #0f172a; padding: 35px 35px; text-align: center;">
      <table width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="padding: 0 10px;">
            <p style="font-size: 32px; font-weight: 800; color: #fff; margin: 0;">4 Wks</p>
            <p style="font-size: 12px; font-weight: 600; color: #94a3b8; margin: 4px 0 0; text-transform: uppercase;">Average Launch</p>
          </td>
          <td style="padding: 0 10px;">
            <p style="font-size: 32px; font-weight: 800; color: #fff; margin: 0;">100%</p>
            <p style="font-size: 12px; font-weight: 600; color: #94a3b8; margin: 4px 0 0; text-transform: uppercase;">IP Ownership</p>
          </td>
          <td style="padding: 0 10px;">
            <p style="font-size: 32px; font-weight: 800; color: #fff; margin: 0;">24/7</p>
            <p style="font-size: 12px; font-weight: 600; color: #94a3b8; margin: 4px 0 0; text-transform: uppercase;">Support Ops</p>
          </td>
        </tr>
      </table>
    </div>

    <div style="padding: 40px 35px;">
      <p style="font-size: 13px; font-weight: 700; color: #7c3aed; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 15px;">The Founder's Dilemma</p>
      <p style="font-size: 16px; line-height: 1.8; color: #475569; margin: 0 0 25px;">
        Hiring a full-time senior team takes months and costs $300k+. Agencies often ship garbage that breaks. We provide a <strong>third option</strong>: Core senior engineering talent that scales with your funding rounds.
      </p>

      <div style="background: #f1f5f9; border-left: 4px solid #7c3aed; border-radius: 4px 12px 12px 4px; padding: 25px;">
        <p style="font-size: 15px; font-style: italic; color: #334155; margin: 0;">
          "Working with Rapsora is like having a CTO in your back pocket. They understood our business goals before they ever touched the code."
        </p>
        <p style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 15px 0 0;">— Series A Tech Founder</p>
      </div>
    </div>

    <div style="padding: 10px 35px 50px; text-align: center;">
      <a href="https://rapsora.com" style="display: inline-block; background: #0f172a; color: #fff; padding: 20px 50px; border-radius: 12px; font-size: 16px; font-weight: 700; text-decoration: none; box-shadow: 0 10px 30px rgba(15,23,42,0.2);">
        Get Your Tech Audit →
      </a>
      <p style="font-size: 14px; color: #64748b; margin: 20px 0 0;">Limited to 2 new partners per month.</p>
    </div>

    <div style="padding: 0 35px 40px;">
      <div style="border-top: 1px solid #e2e8f0; padding-top: 30px;">
        <p style="font-size: 16px; line-height: 1.8; color: #475569; margin: 0 0 20px;">
          [Name], let's talk about the technical roadmap for <strong>[CompanyName]</strong>. I have a few ideas on how to cut your current infra costs while increasing deployment frequency.
        </p>
        <p style="margin: 0; font-size: 16px; font-weight: 700; color: #0f172a;">Vasu</p>
        <p style="margin: 4px 0 0; font-size: 14px; color: #64748b;">Managing Partner, Rapsora</p>
      </div>
    </div>

    <div style="background-color: #0a0a0f; padding: 40px 30px; text-align: center;">
      <div style="margin-bottom: 20px;">
        <a href="https://www.linkedin.com/in/rapsora-technologies-7b1b123a9/" style="display: inline-block; margin: 0 10px; text-decoration: none;">
          <img src="https://img.icons8.com/ios-filled/32/ffffff/linkedin.png" width="24" height="24" alt="LinkedIn" style="display: block;" />
        </a>
        <a href="https://www.instagram.com/rapsoratech/" style="display: inline-block; margin: 0 10px; text-decoration: none;">
          <img src="https://img.icons8.com/ios-filled/32/ffffff/instagram-new.png" width="24" height="24" alt="Instagram" style="display: block;" />
        </a>
        <a href="https://x.com/rapsoratech?s=11" style="display: inline-block; margin: 0 10px; text-decoration: none;">
          <img src="https://img.icons8.com/ios-filled/32/ffffff/x.png" width="24" height="24" alt="X" style="display: block;" />
        </a>
        <a href="https://www.facebook.com/people/RapSora-Technologies/61587384332275/" style="display: inline-block; margin: 0 10px; text-decoration: none;">
          <img src="https://img.icons8.com/ios-filled/32/ffffff/facebook-new.png" width="24" height="24" alt="Facebook" style="display: block;" />
        </a>
      </div>
      <p style="margin: 0; font-size: 11px; color: #475569; letter-spacing: 2px; text-transform: uppercase;">
        RAPSORA TECHNOLOGIES • KANPUR • INDIA
      </p>
    </div>
  </div>
  <div style="height: 40px;"></div>
</div>
    `
  },
  {
    id: "school",
    name: "School / Education",
    subject: "A smarter digital presence for [CompanyName]",
    bodyHTML: `
<div style="font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f7; padding: 0; margin: 0;">

  <img src="https://res.cloudinary.com/dswzqgdf3/image/upload/v1775910268/Banner_js0fuy.png" alt="Rapsora Banner" style="width: 100%; height: auto; display: block;" />

  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0f 0%, #1a1028 100%); text-align: center; padding: 50px 30px 40px;">
    <h1 style="font-size: 34px; font-weight: 800; color: #ffffff; line-height: 1.2; margin: 0 0 10px; letter-spacing: -0.5px;">
      Is [CompanyName]<br/>Next-Gen Ready?
    </h1>
    <p style="font-size: 14px; color: #a78bfa; font-weight: 600; margin: 0 0 20px; letter-spacing: 1px; text-transform: uppercase;">
      Stop Losing Admissions to Technology Gap
    </p>
    <p style="font-size: 15px; line-height: 1.7; color: #c4c4cc; margin: 0; max-width: 440px; display: inline-block;">
      Modern parents don't visit the school first. They visit your website. If it doesn't impress, you've lost the student before the gate opens.
    </p>
  </div>

  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 0 0 20px 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08);">

    <div style="padding: 36px 30px 28px;">
      <h2 style="font-size: 22px; font-weight: 700; color: #111; margin: 0 0 16px;">Dear [Name],</h2>
      <p style="font-size: 15px; line-height: 1.7; color: #555; margin: 0 0 14px;">
        I took a close look at <strong>[CompanyName]</strong>'s digital presence. You're doing incredible work at the school, but the technology on the front-end doesn't reflect your excellence.
      </p>
      <p style="font-size: 15px; line-height: 1.7; color: #555; margin: 0;">
        While other schools are using automated admissions and parent apps to lock in students, many are still stuck with paperwork. We provide the "Tech-Upgrade" that top-tier schools use.
      </p>
    </div>

    <div style="height: 1px; background: #f0f0f0; margin: 0 30px;"></div>

    <div style="padding: 28px 30px;">
      <p style="font-size: 12px; font-weight: 700; color: #a78bfa; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 20px; text-align: center;">Our School Transformation Stack</p>
      <table width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="width: 50%; padding: 8px; vertical-align: top;">
            <div style="background: #f8f7ff; border-radius: 14px; padding: 20px; text-align: center;">
              <div style="font-size: 28px; margin-bottom: 8px;">🏫</div>
              <p style="font-size: 14px; font-weight: 700; color: #111; margin: 0 0 4px;">Smart Website</p>
              <p style="font-size: 12px; color: #777; margin: 0;">Designed to convert anonymous visitors into admissions.</p>
            </div>
          </td>
          <td style="width: 50%; padding: 8px; vertical-align: top;">
            <div style="background: #f8f7ff; border-radius: 14px; padding: 20px; text-align: center;">
              <div style="font-size: 28px; margin-bottom: 8px;">🤝</div>
              <p style="font-size: 14px; font-weight: 700; color: #111; margin: 0 0 4px;">Parent App</p>
              <p style="font-size: 12px; color: #777; margin: 0;">Build trust with instant attendance & performance updates.</p>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <div style="background: linear-gradient(90deg, #a78bfa, #7c3aed); padding: 28px 30px; text-align: center;">
      <table width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="width: 33%; text-align: center;">
            <p style="font-size: 28px; font-weight: 800; color: #fff; margin: 0;">2X</p>
            <p style="font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.8); margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1px;">Inquiry Rate</p>
          </td>
          <td style="width: 33%; text-align: center;">
            <p style="font-size: 28px; font-weight: 800; color: #fff; margin: 0;">Zero</p>
            <p style="font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.8); margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1px;">Paperwork</p>
          </td>
          <td style="width: 33%; text-align: center;">
            <p style="font-size: 24px; font-weight: 800; color: #fff; margin: 0;">₹0</p>
            <p style="font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.8); margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1px;">Maintenance</p>
          </td>
        </tr>
      </table>
    </div>

    <div style="padding: 32px 30px;">
      <p style="font-size: 12px; font-weight: 700; color: #a78bfa; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 14px;">The Brutal Reality</p>
      <p style="font-size: 15px; line-height: 1.7; color: #555; margin: 0 0 20px;">
        Every inquiry at <strong>[CompanyName]</strong> that is handled manually is a risk. Parents today expect speed. If they have to call for basic info, they'll often just click on the next school in Google.
      </p>

      <div style="background: #0a0a0f; border-radius: 14px; padding: 20px; margin-bottom: 12px;">
        <table width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
          <td style="width: 36px; vertical-align: top; padding-top: 2px;">
            <div style="width: 28px; height: 28px; background: #a78bfa; border-radius: 50%; text-align: center; line-height: 28px; color: #fff; font-size: 13px; font-weight: 700;">!</div>
          </td>
          <td style="padding-left: 12px;">
            <p style="font-size: 14px; color: #fff; font-weight: 600; margin: 0 0 4px;">Don't be the 'Traditional' School</p>
            <p style="font-size: 13px; color: #999; margin: 0;">Traditional is good for values, bad for management. Upgrade to Digital.</p>
          </td>
        </tr></table>
      </div>
    </div>

    <div style="padding: 10px 30px 36px; text-align: center;">
      <a href="https://rapsora.com" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #a78bfa); color: #fff; padding: 16px 40px; border-radius: 50px; font-size: 15px; font-weight: 700; text-decoration: none; box-shadow: 0 8px 24px rgba(124,58,237,0.3);">
        Show Me The Demo Version
      </a>
      <p style="font-size: 13px; color: #999; margin: 16px 0 0;">(It takes exactly 3 minutes of your time)</p>
    </div>

    <div style="padding: 0 30px 32px;">
      <div style="border-top: 1px solid #eee; padding-top: 24px;">
        <p style="font-size: 15px; line-height: 1.7; color: #555; margin: 0 0 20px;">
          [Name], let's get <strong>[CompanyName]</strong> the digital recognition it truly deserves. When is a good time for a 5-minute walkthrough?
        </p>
        <p style="margin: 0; font-size: 15px; font-weight: 700; color: #111;">Vasu</p>
        <p style="margin: 4px 0 0; font-size: 13px; color: #777;">Rapsora Technologies</p>
      </div>
    </div>

    <div style="background-color: #0a0a0f; padding: 32px 30px; text-align: center;">
      <div style="margin-bottom: 15px;">
        <a href="https://www.linkedin.com/in/rapsora-technologies-7b1b123a9/" style="display: inline-block; margin: 0 8px; text-decoration: none;">
          <img src="https://img.icons8.com/ios-filled/24/666666/linkedin.png" width="18" height="18" alt="LinkedIn" />
        </a>
        <a href="https://www.instagram.com/rapsoratech/" style="display: inline-block; margin: 0 8px; text-decoration: none;">
          <img src="https://img.icons8.com/ios-filled/24/666666/instagram-new.png" width="18" height="18" alt="Instagram" />
        </a>
        <a href="https://www.facebook.com/people/RapSora-Technologies/61587384332275/" style="display: inline-block; margin: 0 8px; text-decoration: none;">
          <img src="https://img.icons8.com/ios-filled/24/666666/facebook-new.png" width="18" height="18" alt="Facebook" />
        </a>
      </div>
      <p style="margin: 0; font-size: 12px; color: #666; letter-spacing: 0.5px;">
        rapsora.com &nbsp;&bull;&nbsp; Kanpur, India
      </p>
    </div>
  </div>
  <div style="height: 30px;"></div>
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
