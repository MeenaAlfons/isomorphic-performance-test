const generateIsomorphic = (size, probability) => {
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    const notUsed = new Set();
    for (var i = 0; i < characters.length; i++) {
      notUsed.add(characters.charAt(i));
    }
    
    const elementProbability = Math.pow(probability,size);
    let input1 = "";
    let input2 = "";
    const map = {};
    const used = {};
    for(let i=0;i<size;++i) {
        // choose random char to be added to input 1;
      const char1 = characters.charAt(Math.floor(Math.random() * charactersLength));
      input1 += char1;
      let char2 = '';
      if(char1 in map) {
        char2 = map[char1];
      } else {
        // Choose new char2 not used before
           char2 = Array.from(notUsed.values())[Math.floor(Math.random() * notUsed.size)];
        notUsed.delete(char2);
        map[char1] = char2;
      }
      // Use elementProbability to either set char2 or any other character
      // This one deviates a little because we are choosing from all chars instead
      if(Math.random() < elementProbability) {
          input2 += char2;
      } else {
        input2 += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
    }
      return {input1, input2};
  };
  
  var isIsomorphicMapSet = function(s, t) {
      let map = new Map();
      let used = new Set();
      for(let i=0;i<s.length;++i) {
          if(map.has(s[i])){
              if (t[i] != map.get(s[i]) ) {
                  return false;
              }
          } else {
              if(used.has(t[i])) {
                  return false;
              }
              map.set(s[i], t[i]);
              used.add(t[i]);
          }
      }
      return true;
  };

  var isIsomorphicObjectObject = function(s, t) {
      let map = {};
      let used = {};
      for(let i=0;i<s.length;++i) {
          if(s[i] in map){
              if (t[i] != map[s[i]]) {
                  return false;
              }
          } else {
              if(t[i] in used) {
                  return false;
              }
              map[s[i]] = t[i];
              used[t[i]] = true
          }
      }
      return true;
  };

  var isIsomorphicObjectSet = function(s, t) {
    let map = {};
    let used = new Set();
    for(let i=0;i<s.length;++i) {
        if(s[i] in map){
            if (t[i] != map[s[i]]) {
                return false;
            }
        } else {
            if(used.has(t[i])) {
                return false;
            }
            map[s[i]] = t[i];
            used.add(t[i]);
        }
    }
    return true;
};

var isIsomorphicMapObject = function(s, t) {
    let map = new Map();
    let used = {};
    for(let i=0;i<s.length;++i) {
        if(map.has(s[i])){
            if (t[i] != map.get(s[i])) {
                return false;
            }
        } else {
            if(t[i] in used) {
                return false;
            }
            map.set(s[i], t[i]);
            used[t[i]] = true
        }
    }
    return true;
};

///////////// Prepare Data
const probability = 0.5;
const total = 1000;
const data = [];
for(let i=0;i<total;++i){
    const size = Math.floor(Math.random() * 1000);
    data.push(generateIsomorphic(size,probability))
}

////// rRepare test
const test = (isIsomorphicFunc) => {
    startTime = new Date();
    for(let i=0;i<total;++i){
        const {input1,input2} = data[i];
        isIsomorphicFunc(input1, input2)
    }
    endTime = new Date();
    return endTime - startTime
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

const testRunner = (arrayOfFunc, repeat = 1000) => {
    const result = [];
    const sample = []
    for(let i = 0; i < arrayOfFunc.length;++i){
        result.push([]);
        sample.push({i:i,func:arrayOfFunc[i]})
    }
    for(let i=0;i<repeat;++i){
        shuffle(sample)
        sample.forEach(({i, func})=>{
            result[i].push(test(func))
        })
    }
    
    return result;
}

const avg = (d) => {
    return d.reduce((a, b) => a + b, 0) / d.length;
}

const results = testRunner([
    isIsomorphicObjectObject,
    isIsomorphicMapObject,
    isIsomorphicObjectSet,
    isIsomorphicMapSet
]);


console.log("isIsomorphicObjectObject => " + avg(results[0]));
console.log("isIsomorphicMapObject => " + avg(results[1]));
console.log("isIsomorphicObjectSet => " + avg(results[2]));
console.log("isIsomorphicMapSet => " + avg(results[3]));
