import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { ProductCategory } from '../../../../../models/product-category.interface';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-menu.component.html',
  styleUrl: './category-menu.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoryMenuComponent {
  categoryTree: ProductCategory[] = [];

  constructor(private router: Router, private elRef: ElementRef) {
    this.getProductCategories();
  }

  private getProductCategories() {
    fetch(environment.baseUri + '/product-categories')
      .then(response => response.json())
      .then(data => {
        this.buildCategoryTree(data);
        const collapse = document.querySelector(".menu-collapse") as any;
        if (collapse != null) {
          collapse.value = [];
          data.forEach((category: ProductCategory) => {
            collapse.value.push(category.id);
          });
        }
        this.buildMenu();
        this.buildRouterLinks();
      });
  }

  private buildCategoryTree(categories: ProductCategory[]) {
    const categoryMap = new Map<number, ProductCategory>();
    categories.forEach(category => categoryMap.set(category.id, category));

    categories.forEach(category => {
      if (category.parentCategoryId != null) {
        const parent = categoryMap.get(category.parentCategoryId);
        if (parent != null) {
          if (parent.children == null) {
            parent.children = [];
          }
          parent.children.push(category);
        }
      } else {
        this.categoryTree.push(category);
      }
    });
  }

  private buildMenu() {
    const menu = document.querySelector(".menu-collapse") as HTMLElement;
    if (menu != null) {
      this.categoryTree.forEach((category: ProductCategory) => {
        if (category.children != null) {
          menu.innerHTML += `
              <mdui-collapse-item class="menu-item-${category.id}" value="${category.id}" trigger=".trigger-${category.id}">
                <mdui-list-item slot="header">
                  <a style="color: rgb(var(--mdui-color-on-surface)); text-decoration: none" href="/shop/${category.name.toLowerCase()}" class="menu-link">${category.name}</a>
                  <mdui-icon slot="end-icon" class="trigger-${category.id}" name="keyboard_arrow_down"></mdui-icon>
                </mdui-list-item>
              </mdui-collapse-item>
            `;
          this.buildChildren(category);
        }
      });
    }

    setTimeout(() => {
      if ((window as any).mdui) {
        (window as any).mdui.mutation();
      }
    }, 0);
  }

  private buildChildren(category: ProductCategory) {
    if (category.children == null) {
      return;
    }
    const menuItem = document.querySelector(`.menu-item-${category.id}`) as any;
    menuItem.innerHTML += `
      <div style="display: flex; flex-direction: row; justify-content: space-between">
        <div style="width: 2px; background-color: rgb(var(--mdui-color-primary)); margin-right: 5px"></div>
        <mdui-collapse style="flex-grow: 1" class="menu-collapse-${category.id}">
        </mdui-collapse>
      </div>
    `;
    category.children?.forEach((child: ProductCategory) => {
      const menuItems = document.querySelector(`.menu-collapse-${category.id}`) as any;
      if (menuItems != null) {
        if (child.children != null) {
          menuItems.innerHTML += `
            <mdui-collapse-item class="menu-item-${child.id}" value="${child.id}" trigger=".trigger-${child.id}">
              <mdui-list-item slot="header">
                <a style="color: rgb(var(--mdui-color-on-surface)); text-decoration: none" href="/shop/${child.name.toLowerCase()}" class="menu-link">${child.name}</a>
                <mdui-icon slot="end-icon" class="trigger-${child.id}" name="keyboard_arrow_down"></mdui-icon>
              </mdui-list-item>
            </mdui-collapse-item>
          `;
          this.buildChildren(child);
        } else {
          menuItems.innerHTML += `
            <mdui-list-item class="menu-item-${child.id}" value="${child.id}">
              <a style="color: rgb(var(--mdui-color-on-surface)); text-decoration: none" href="/shop/${child.name.toLowerCase()}" class="menu-link">${child.name}</a>
            </mdui-list-item>
          `;
        }
      }
    });
  }

  private buildRouterLinks() {
    const menuLinks = this.elRef.nativeElement.querySelectorAll('.menu-link');
    menuLinks.forEach((link: HTMLElement) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const url = link.getAttribute('href') as string;
        this.router.navigateByUrl(url);
      });
    });
  }
}
