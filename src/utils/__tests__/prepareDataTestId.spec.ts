import { prepareDataTestId } from '@/utils/prepareDataTestId';

describe('prepareDataTestId', () => {
  it('should create a testId', () => {
    expect(prepareDataTestId('prefix', 'testIdName', 'suffix')).toEqual('prefix-testIdName-suffix');
    expect(prepareDataTestId('prefix', 'testIdName')).toEqual('prefix-testIdName');
    expect(prepareDataTestId('testId')).toEqual('testId');
  });
});
