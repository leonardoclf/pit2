import { Injectable } from "@angular/core";

export interface Menu{
    state:string;
    name:string;
    icon:string;
    role:string;
}

const MENUITEMS = [
    {state:'dasboard', name:'Dashboard', icon:'dashboard', role:''},
    {state:'category', name:'Gerenciar Categorias', icon:'category', role:'admin'},
    {state:'product', name:'Gerenciar Produtos', icon:'inventory_2', role:'admin'},
    {state:'order', name:'Gerenciar Pedidos', icon:'list_alt', role:''},
    {state:'bill', name:'Visualizar Faturas', icon:'import_contacts', role:''},
    {state:'user', name:'Visualizar Usuarios', icon:'people', role:'admin'},
]

@Injectable()
export class MenuItems{
    getMenuItems(): Menu[] {
        return MENUITEMS;
    }
}