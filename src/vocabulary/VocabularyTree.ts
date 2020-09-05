export declare type TreeEntry = {
  entry: StringResolvable;
  positionMin: number;
  positionMax: number;
};

export class TreeNode {
  private readonly entry: TreeEntry;

  private readonly left?: TreeNode;
  private readonly right?: TreeNode;

  private constructor(entry: TreeEntry, left?: TreeNode, right?: TreeNode) {
    this.entry = entry;
    this.left = left;
    this.right = right;
  };

  static create(entries: TreeEntry[], indexMin: number = 0, indexMax?: number)
    : TreeNode {
    const resolvedIndexMax = indexMax ?? entries.length - 1;
    const averageIndex = Math.floor((indexMin + resolvedIndexMax) / 2);
    const thisEntry = entries[averageIndex];

    const left: TreeNode | undefined = indexMin == averageIndex ?
      undefined :
      TreeNode.create(entries, indexMin, averageIndex - 1);
    const right: TreeNode | undefined = resolvedIndexMax == averageIndex ?
      undefined :
      TreeNode.create(entries, averageIndex + 1, resolvedIndexMax);

      return new TreeNode(thisEntry, left, right);
  };

  find(position: number): StringResolvable | undefined {
    if (position < this.entry.positionMin) {
      return this.left?.find(position) ?? undefined;
    }
    if (position >= this.entry.positionMax) {
      return this.right?.find(position) ?? undefined;
    }

    return this.entry.entry;
  };

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

export class VocabularyTree {
  private rootNode: TreeNode;

  maxPosition: number;

  private constructor(rootNode: TreeNode, maxPosition: number) {
    this.rootNode = rootNode;
    this.maxPosition = maxPosition;
  }

  static create(entries: WeightedEntry[]) {
    let currentPosition = 0;
    const treeEntries = entries.map(entry => {
      const nextPosition = currentPosition + entry.weight;
      const treeEntry = {
        entry: entry.entry,
        positionMin: currentPosition,
        positionMax: nextPosition,
      };
      currentPosition = nextPosition;
      return treeEntry;
    });

    const rootNode = TreeNode.create(treeEntries);
    return new VocabularyTree(rootNode, currentPosition);
  }

  find(position: number) {
    return this.rootNode.find(position);
  }
}
