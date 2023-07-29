import React from 'react';
import '../assets/Menu.css';

type MenuProps = {
  selectedMenu: string;
  onSelectMenu: (menuName: string) => void;
}

export const Menu: React.FC<MenuProps> = ({selectedMenu, onSelectMenu}) => {
  const handleMenuClick = (menuName: string) => {
    onSelectMenu(menuName);
  }

  return (
    <ul className={"menu"}>
      <li
        onClick={() => handleMenuClick("Favoritos")}
        className={selectedMenu === "Favoritos" ? "selected" : ""}
      >
        Favoritos
      </li>
      <li
        onClick={() => handleMenuClick('Bizkaia')}
        className={ selectedMenu === 'Bizkaia' ? 'selected' : '' }
      >
          Bizkaia
      </li>
      <li
        onClick={() => handleMenuClick('Bilbao')}
        className={ selectedMenu === 'Bilbao' ? 'selected' : '' }
      >
        Bilbao
      </li>
    </ul>
  )
}
