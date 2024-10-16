import React from 'react';
import { useTranslation } from 'react-i18next';

interface TranslateProps {
  str: string;
}

const Translate: React.FC<TranslateProps> = ({ str }) => {
  const { t } = useTranslation('common');
  return <>{t(str)}</>;
};

export default Translate;
