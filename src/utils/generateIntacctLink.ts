export function generateIntacctLink(sessionId: string = '') {
  const viewInvestmentsOperationConstant = 11;
  const intacctUrl = `/lister.phtml?.sess=${sessionId}&.op=${viewInvestmentsOperationConstant}`;

  return `${process.env.NEXT_PUBLIC_INTACCT_HOSTNAME}/ia/acct${intacctUrl}`;
}
