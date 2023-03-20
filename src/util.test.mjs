import { describe, it, expect } from 'vitest';
import { normalizeData, genObjectKeyType } from './util.mjs';

describe('test: utils', () => {
  it('normalizeData: list data work', async () => {
    const data = {
      "resultCode": 0,
      "result": {
        "total": 2,
        "items": [
          {
            "robotId": "8db8d654-0647-41b2-9614-aa4d5a32d1a2",
            "lastHeartBeatTime": -1,
            "inBlackList": 0,
            "status": 2,
            "currentAccountId": "",
          }
        ]
      }
    }
    expect(normalizeData(data)).toEqual(data.result.items[0]);
  });

  it('normalizeData: detail data work', async () => {
    const data = {
      "resultCode": 0,
      "result": {
        "robotId": "8db8d654-0647-41b2-9614-aa4d5a32d1a2",
        "createdTime": 1667801449,
        "updatedTime": 1668689300,
        "lastHeartBeatTime": -1,
        "recentOnlineTime": 1668689299,
      }
    }
    expect(normalizeData(data)).toEqual(data.result);
  })

  it('normalizeData: mock list data work', async () => {
    const data = {
      "total": 2,
      "items": [
        {
          "robotId": "8db8d654-0647-41b2-9614-aa4d5a32d1a2",
          "lastHeartBeatTime": -1,
          "inBlackList": 0,
          "status": 2,
          "currentAccountId": "",
        }
      ]
    }
    expect(normalizeData(data)).toEqual(data.items[0]);
  });

  it('normalizeData: mock detail data work', async () => {
    const data = {
      "robotId": "8db8d654-0647-41b2-9614-aa4d5a32d1a2",
      "createdTime": 1667801449,
      "updatedTime": 1668689300,
      "lastHeartBeatTime": -1,
      "recentOnlineTime": 1668689299,
    }
    expect(normalizeData(data)).toEqual(data);
  })

  it('genObjectKeyType: base test', async () => {
    expect(genObjectKeyType({ a: 1, b: 2, c: 3 })).toEqual({ a: 'number', b: 'number', c: 'number' });

    expect(genObjectKeyType({ a: 1, b: 2, c: 'hello' })).toEqual({ a: 'number', b: 'number', c: 'string' });

    expect(genObjectKeyType({ a: 1, b: 2, c: 'hello', d: { d1: ['a', 'b'], d2: 'world' } }))
      .toEqual({ a: 'number', b: 'number', c: 'string', d: { d1: ['string'], d2: 'string' } });

    expect(genObjectKeyType({
      a: 1,
      b: 2,
      c: 'hello',
      d: {
        d1: [
          { e1: 'b', e2: 10 },
          { e1: 'g', e2: 5 }
        ],
        d2: 'world'
      }
    })).toEqual({
      a: 'number',
      b: 'number',
      c: 'string',
      d: {
        d1: [{
          e1: "string",
          e2: "number"
        }],
        d2: 'string'
      }
    });
  })
})