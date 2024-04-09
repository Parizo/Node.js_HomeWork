import menu from "../db/menu.json" assert {type: "json"};

import fs from 'fs';

import path, { dirname } from "path";

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const menuController = {

    getMenu: (req, res) => {
        try {
    if(req.query.paginate === 'true') {
   
    res.status(200).json(paginatedMenu);
    
    } else {
        res.status(200).json(menu)
    }
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while retrieving users.' })
        }
    },

    getMenuById: (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const menus = menu.find(menus => menus.id === id)
    
            if (!menus) {
                res.status(404).json({ message: 'Menu not found.' });
                return;
            }
    
            res.status(200).json(menus)
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while retrieving the menu by id.' })
        }
    },

    createMenu: async (req, res) => {
        try {
            const newMenu = {
                ...req.body,
            }
    
            menu.push(newMenu);
            menu.forEach((menus, index) => {
                menus.id = index + 1;
            });
    
            await fs.promises.writeFile(path.join(__dirname, '../db/menu.json'), JSON.stringify(menu, null, 2))
    
            res.status(201).json(newMenu)
    
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'An error occurred while creating user.' })
        }
    },

    updateMenu: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const updateMenu = { ...req.body, id };
    
            let menusIndex = menu.findIndex(menus => menus.id === id);
    
            if (menusIndex === -1) {
                res.status(404).json({ message: 'User not found.' });
            }
    
            menu[menusIndex] = updateMenu;
    
            
            await fs.promises.writeFile(path.join(__dirname, '../db/menu.json'), JSON.stringify(menu, null, 2));
            res.status(200).json(updateMenu);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while updating the user' })
        }
    },

    deleteMenu:async (req, res) => {
        try {
            const id = parseInt(req.params.id);
    
            let menusIndex = menu.findIndex(menus => menus.id === id);
        
                if (menusIndex === -1) {
                    res.status(404).json({ message: 'User not found.' });
                    return;
                }
    
                menu.splice(menusIndex, 1)
    
                await fs.promises.writeFile(path.join(__dirname, '../db/menu.json'), JSON.stringify(menu, null, 2));
                res.status(200).json({message: "User successfully deleted."});
    
        } catch (error) {
            console.error(error);
                res.status(500).json({ message: 'An error occurred while deleting the user' })
        }
        },

}

export default menuController;