import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import en from "@/assets/images/en.png";
import fr from "@/assets/images/fr.png";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation('common');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <Select onValueChange={changeLanguage} value={i18n.language}  >
      <SelectTrigger className="w-15 border-none  p-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="w-50">
        <SelectItem value="en">
          <img alt="English" src={en} className="w-5 h-5" />
        </SelectItem>
        <SelectItem value="fr">
          <img alt="French" src={fr} className="w-5 h-5" />
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
