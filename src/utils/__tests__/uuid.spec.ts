import { uuidv4 } from '../uuid';

describe('uuidv4 util', () => {
  const UUID_V4_STRICT_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  it('generates a valid UUID v4 string', () => {
    const id = uuidv4();
    expect(typeof id).toBe('string');
    expect(id).toMatch(UUID_V4_STRICT_REGEX);
  });

  it('generates unique values across multiple calls', () => {
    const count = 500;
    const ids = Array.from({ length: count }, () => uuidv4());
    const unique = new Set(ids);
    expect(unique.size).toBe(count);
    ids.forEach((id) => expect(id).toMatch(UUID_V4_STRICT_REGEX));
  });
});
