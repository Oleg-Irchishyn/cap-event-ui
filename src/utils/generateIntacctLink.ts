type IntacctLinkType = 'edit' | 'view' | 'entity';

interface LinkConfig {
  path: string;
  params: (args: {
    sessionId: string;
    investmentId?: string;
    entityId?: string;
  }) => Record<string, string | number>;
}

type GenerateIntacctLinkTypes = {
  sessionId: string;
  type: IntacctLinkType;
  investmentId?: string;
  entityId?: string;
};

const linkConfigs: Record<IntacctLinkType, LinkConfig> = {
  view: {
    path: '/lister.phtml',
    params: ({ sessionId }) => ({
      sess: sessionId,
      op: 11,
    }),
  },
  entity: {
    path: '/editor.phtml',
    params: ({ sessionId, entityId }) => ({
      sess: sessionId,
      do: 'view',
      r: entityId ?? '',
      it: 'locationentity',
      op: 2154,
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
  return Object.entries(params)
    .map(([key, value]) => `.${key}=${encodeURIComponent(value ?? '')}`)
    .join('&');
}

export const generateIntacctLink = ({
  sessionId,
  type,
  investmentId,
  entityId,
}: GenerateIntacctLinkTypes): string => {
  const config = linkConfigs[type];
  const baseUrl = process.env.NEXT_PUBLIC_INTACCT_HOSTNAME;

  const query = buildDotParams(config.params({ sessionId, investmentId, entityId })).toString();

  return `${baseUrl}/ia/acct${config.path}?${query}`;
};
