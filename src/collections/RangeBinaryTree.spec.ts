// eslint-disable-next-line no-unused-vars
import { TreeItem, TreeNode, RangeBinaryTree } from './RangeBinaryTree';

describe('VocabularyTree.ts', () => {
  describe('TreeNode', () => {
    const entries: TreeItem<string>[] = [
      { item: 'a', positionMin: 0, positionMax: 1, },
      { item: 'b', positionMin: 1, positionMax: 3, },
      { item: 'c', positionMin: 3, positionMax: 8, },
      { item: 'd', positionMin: 8, positionMax: 8.5, },
      { item: 'e', positionMin: 8.5, positionMax: 11, },
      { item: 'f', positionMin: 11, positionMax: 12, },
    ];

    describe('create()', () => {
      it('should create balanced tree', () => {
        const node = TreeNode.create(entries);
        expect(node.maxDepth()).toBe(3);
      });
    });

    describe('find()', () => {
      it('should return correct entry given valid position', () => {
        const node = TreeNode.create(entries);
        expect(node.find(0)).toBe('a');
        expect(node.find(1)).toBe('b');
        expect(node.find(4)).toBe('c');
        expect(node.find(8.25)).toBe('d');
        expect(node.find(8.5)).toBe('e');
        expect(node.find(11.9)).toBe('f');
      });

      it('should return undefined if position is out of range', () => {
        const node = TreeNode.create(entries);
        expect(node.find(-1)).toBe(undefined);
        expect(node.find(12)).toBe(undefined);
      });
    });

    describe('count()', () => {
      it('should return number of nodes in tree', () => {
        const node = TreeNode.create(entries);
        expect(node.count()).toBe(entries.length);
      });
    });
  });

  describe('VocabularyTree', () => {
    const entries = [
      { entry: 'a', weight: 1, },
      { entry: 'b', weight: 4, },
      { entry: 'c', weight: 2, },
      { entry: 'd', weight: 1, },
    ];
    const entryMap: any = entries.reduce((prev, current) => { return { ...prev, [current.entry]: current }; }, {});

    describe('create()', () => {
      it('creates a tree with correct position ranges', () => {
        const tree = RangeBinaryTree.create(entries);
        expect(tree.find(-0.5)).toBe(undefined);
        expect(tree.find(0.5)).toBe(entryMap['a']);
        expect(tree.find(1.5)).toBe(entryMap['b']);
        expect(tree.find(2.5)).toBe(entryMap['b']);
        expect(tree.find(3.5)).toBe(entryMap['b']);
        expect(tree.find(4.5)).toBe(entryMap['b']);
        expect(tree.find(5.5)).toBe(entryMap['c']);
        expect(tree.find(6.5)).toBe(entryMap['c']);
        expect(tree.find(7.5)).toBe(entryMap['d']);
        expect(tree.find(8.5)).toBe(undefined);
      });

      it('sets correct maxPosition', () => {
        const tree = RangeBinaryTree.create(entries);
        expect(tree.maxPosition).toBe(8);
      });
    });
  });
});
