import EchoPilot from '@echopilot/web-sdk';

export const echoPilot = new EchoPilot(process.env.NEXT_PUBLIC_ECHOPILOT_API_KEY!);
