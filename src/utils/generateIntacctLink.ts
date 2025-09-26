type IntacctLinkType = 'edit' | 'view';

interface LinkConfig {
  path: string;
  params: (args: { sessionId: string; investmentId?: string }) => Record<string, string | number>;
}

const linkConfigs: Record<IntacctLinkType, LinkConfig> = {
  view: {
    path: '/lister.phtml',
    params: ({ sessionId }) => ({
      sess: sessionId,
      op: 11,
    }),
  },
  edit: {
    path: '/editor.phtml',
    params: ({ sessionId, investmentId }) => ({
      sess: sessionId,
      do: 'edit',
      r: investmentId ?? '',
      it: 'department',
      op: 96,
    }),
  },
};

function buildDotParams(params: Record<string, string | number | undefined>) {
  return (
    `?` + Object.entries(params).map(([key, value]) => `.${key}=${encodeURIComponent(value ?? '')}`)
  );
}

export function generateIntacctLink(
  sessionId: string = '',
  type: IntacctLinkType,
  investmentId?: string,
): string {
  const config = linkConfigs[type];
  const baseUrl = process.env.NEXT_PUBLIC_INTACCT_HOSTNAME;

  const query = buildDotParams(config.params({ sessionId, investmentId })).toString();

  return `${baseUrl}/ia/acct${config.path}?${query}`;
}
