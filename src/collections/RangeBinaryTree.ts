export interface WeightedItem {
  weight: number;
}

export class TreeItem<T> {
  public constructor(
    /* eslint-disable no-unused-vars */
    public readonly item: T,
    public readonly positionMin: number,
    public readonly positionMax: number,
    /* eslint-enable no-unused-vars */
  ) { }
}

export class TreeNode<T> {
  private constructor(
    /* eslint-disable no-unused-vars */
    private readonly item: TreeItem<T>,
    private readonly left?: TreeNode<T>,
    private readonly right?: TreeNode<T>,
    /* eslint-enable no-unused-vars */
  ) { }

  static create<T>(items: TreeItem<T>[], indexMin: number = 0, indexMax?: number)
    : TreeNode<T> {
    const resolvedIndexMax = indexMax ?? items.length - 1;
    const averageIndex = Math.floor((indexMin + resolvedIndexMax) / 2);
    const thisEntry = items[averageIndex];

    const left: TreeNode<T> | undefined = indexMin == averageIndex ?
      undefined :
      TreeNode.create(items, indexMin, averageIndex - 1);
    const right: TreeNode<T> | undefined = resolvedIndexMax == averageIndex ?
      undefined :
      TreeNode.create(items, averageIndex + 1, resolvedIndexMax);

    return new TreeNode(thisEntry, left, right);
  }

  find(position: number): T | undefined {
    if (position < this.item.positionMin) {
      return this.left?.find(position) ?? undefined;
    }
    if (position >= this.item.positionMax) {
      return this.right?.find(position) ?? undefined;
    }

    return this.item.item;
  }

  count(): number {
    return 1 +
      (this.left?.count() ?? 0) +
      (this.right?.count() ?? 0);
  }

  maxDepth() : number {
    const leftDepth = this.left?.maxDepth() ?? 0;
    const rightDepth = this.right?.maxDepth() ?? 0;
    return 1 + Math.max(leftDepth, rightDepth);
  }
}

export class RangeBinaryTree<T> {
  private constructor(
    /* eslint-disable no-unused-vars */
    private readonly rootNode: TreeNode<T>,
    public readonly maxPosition: number
    /* eslint-enable no-unused-vars */
  ) { }

  static create(items: WeightedItem[]) {
    let currentPosition = 0;
    const treeEntries = items.map(item => {
      const nextPosition = currentPosition + item.weight;
      const treeItem = {
        item,
        positionMin: currentPosition,
        positionMax: nextPosition,
      };
      currentPosition = nextPosition;
      return treeItem;
    });

    const rootNode = TreeNode.create(treeEntries);
    return new RangeBinaryTree(rootNode, currentPosition);
  }

  find(position: number) {
    return this.rootNode.find(position);
  }
}
