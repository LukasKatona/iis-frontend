import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../../../../models/product-category.interface';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-category-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTreeModule, MatIconModule],
  templateUrl: './category-menu.component.html',
  styleUrl: './category-menu.component.scss'
})
export class CategoryMenuComponent {
  menuTree: ProductCategory[] = [];

  private _transformer = (node: ProductCategory, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  constructor() {
    this.getProductCategories();
  }

  private getProductCategories() {
    fetch(environment.baseUri + '/product-categories')
      .then(response => response.json())
      .then(data => {
        this.menuTree = this.buildCategoryTree(data);
        this.dataSource.data = this.menuTree;
      });
  }

  private buildCategoryTree(categories: ProductCategory[]): ProductCategory[] {
    const categoryMap: { [key: number]: ProductCategory & { id: number, parentCategoryId?: number | null } } = {};
    
    categories.forEach(category => {
      categoryMap[category.id] = { ...category, children: [] };
    });
  
    const tree: ProductCategory[] = [];
  
    categories.forEach(category => {
      if (category.parentCategoryId === null) {
        tree.push(categoryMap[category.id]);
      } else {
        if (category.parentCategoryId !== undefined) {
          const parent = categoryMap[category.parentCategoryId];
          if (parent) {
            parent.children!.push(categoryMap[category.id]);
          }
        }
      }
    });
  
    return tree;
  }
}
