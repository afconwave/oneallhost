import React from 'react';
import { TldRegistrationTemplate } from '@/components/domains';

export default async function GtldRegistrationPage({
  params,
}: {
  params: Promise<{ tld: string }>;
}) {
  const { tld } = await params;
  return <TldRegistrationTemplate tldKey={tld} defaultCategory="gtld" />;
}
