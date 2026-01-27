import { generateIntacctLink } from '../generateIntacctLink';

describe('generateIntacctLink', () => {
  const originalEnv = process.env.NEXT_PUBLIC_INTACCT_HOSTNAME;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_INTACCT_HOSTNAME = 'https://test.intacct.com';
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_INTACCT_HOSTNAME = originalEnv;
  });

  it('generates view link with sessionId', () => {
    const link = generateIntacctLink({
      sessionId: 'test-session-123',
      type: 'view',
    });

    expect(link).toBe(
      'https://test.intacct.com/ia/acct/lister.phtml?.sess=test-session-123&.op=11',
    );
  });

  it('generates edit link with sessionId and investmentId', () => {
    const link = generateIntacctLink({
      sessionId: 'test-session-456',
      type: 'edit',
      investmentId: 'inv-123',
    });

    expect(link).toBe(
      'https://test.intacct.com/ia/acct/editor.phtml?.sess=test-session-456&.do=edit&.r=inv-123&.it=department&.op=96',
    );
  });

  it('generates entity link with sessionId and entityId', () => {
    const link = generateIntacctLink({
      sessionId: 'test-session-789',
      type: 'entity',
      entityId: 'entity-456',
    });

    expect(link).toBe(
      'https://test.intacct.com/ia/acct/editor.phtml?.sess=test-session-789&.do=view&.r=entity-456&.it=locationentity&.op=2154',
    );
  });

  it('handles empty investmentId in edit link', () => {
    const link = generateIntacctLink({
      sessionId: 'test-session',
      type: 'edit',
    });

    expect(link).toContain('.r=');
    expect(link).toContain('test-session');
  });

  it('handles empty entityId in entity link', () => {
    const link = generateIntacctLink({
      sessionId: 'test-session',
      type: 'entity',
    });

    expect(link).toContain('.r=');
    expect(link).toContain('test-session');
  });

  it('URL encodes special characters in parameters', () => {
    const link = generateIntacctLink({
      sessionId: 'test&session=123',
      type: 'view',
    });

    expect(link).toContain('test%26session%3D123');
  });
});
