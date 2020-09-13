import {
  getTotalWeightOfEntries,
} from './array';

import {
  parsePlaceholderNotation,
  findPlaceholdersByNotation,
  findKeysInPlaceholder
} from './placeholder';

describe('utils', () => {
  /**
   * ARRAY UTIL
   */
  describe('array', () => {
    describe('getTotalWeightOfEntries', () => {
      it('should return the correct total weight', () => {
        const entries = [
          { entry: 'one', weight: 5 },
          { entry: 'two', weight: 2 },
          { entry: 'three', weight: 6 },
          { entry: 'four', weight: 10 },
          { entry: 'five', weight: 543 },
        ];
        expect(getTotalWeightOfEntries(entries)).toEqual(5 + 2 + 6 + 10 + 543);
      });
    });
  });

  /**
   * PLACEHOLDER UTIL
   */
  describe('placeholder', () => {
    describe('parsePlaceholderNotation', () => {
      it.each([
        [ '[ ]', { start: '[', end: ']' } ],
        [ '{{ }}', { start: '{{', end: '}}' } ],
        [ '%% (&', { start: '%%', end: '(&' } ],
        [ ':: ::', { start: '::', end: '::' } ],
        [ '| |', { start: '|', end: '|' } ],
      ])('should result in the expected placeholderNotation', (input, expected) => {
        expect(parsePlaceholderNotation(input)).toEqual(expected);
      });
    });

    describe('findPlaceholdersByNotation', () => {
      it.each([
        [ 'Hopefully we will find the [placeholder].', { start: '[', end: ']' }, [ '[placeholder]' ] ],
        [ 'Hopefully we will find the {{placeholder}}.', { start: '{{', end: '}}' }, [ '{{placeholder}}' ] ],
        [ 'Hopefully we will find the %%placeholder(&.', { start: '%%', end: '(&' }, [ '%%placeholder(&' ] ],
        [ 'Hopefully we will find the ::placeholder::.', { start: '::', end: '::' }, [ '::placeholder::' ] ],
        [ 'Hopefully we will find the |placeholder|.', { start: '|', end: '|' }, [ '|placeholder|' ] ],
      ])('should find the expected placeholders', (input, placeholderNotation, expected) => {
        expect(findPlaceholdersByNotation(input, placeholderNotation)).toEqual(expected);
      });
    });

    describe('findKeysInPlaceholder', () => {
      it.each([
        [ '[place, a-holder, one, adjective-s]', { start: '[', end: ']' }, [ 'place', 'a-holder', 'one', 'adjective-s' ] ],
        [ '{{place, a-holder, one, adjective-s}}', { start: '{{', end: '}}' }, [ 'place', 'a-holder', 'one', 'adjective-s' ] ],
        [ '%%place, a-holder, one, adjective-s(&', { start: '%%', end: '(&' }, [ 'place', 'a-holder', 'one', 'adjective-s' ] ],
        [ '::place, a-holder, one, adjective-s::', { start: '::', end: '::' }, [ 'place', 'a-holder', 'one', 'adjective-s' ] ],
        [ '|place, a-holder, one, adjective-s|', { start: '|', end: '|' }, [ 'place', 'a-holder', 'one', 'adjective-s' ] ],
      ])('should find the expected keys', (input, placeholderNotation, expected) => {
        expect(findKeysInPlaceholder(input, placeholderNotation)).toEqual(expected);
      });
    });
  });
});