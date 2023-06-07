#include <map>
#include <set>
#include <string>
#include <vector>
#include <cmath>
#include <random>
#include <iostream>
#include <numeric>

using namespace std;

auto &singleRNG() {
    static auto rng = std::default_random_engine {};
    static bool initialised = false;
    if (!initialised) {
        rng.seed(std::chrono::system_clock::now().time_since_epoch().count());
        initialised = true;
    }
    return rng;
}

int randomInt(int max) {
    std::uniform_int_distribution<unsigned> distrib(0, max);
    return distrib(singleRNG());
};

double randomProbability() {
    std::uniform_real_distribution<> dist(0, 1);
    return dist(singleRNG());
}

bool isIsomorphicStd(const string &s, const string &t) {
    map<char,char> charMap;
    set<char> used;

    for(int i=0; i < s.size() ;++i) {
        auto it = charMap.find(s[i]);
        if(it != charMap.end()){
            if (t[i] != it->second ) {
                return false;
            }
        } else {
            if(used.find(t[i]) != used.end()) {
                return false;
            }
            charMap[s[i]] = t[i];
            used.insert(t[i]);
        }
    }
    return true;
}

bool isIsomorphicArray(const string &s, const string &t) {
    char all[512];
    memset(all, 0, 512*sizeof(char));
    char *charMap = all;
    char *used = &all[256];
    
    for(int i=0; i < s.size() ;++i) {
        if(charMap[s[i]] != 0){
            if (t[i] != charMap[s[i]] ) {
                return false;
            }
        } else {
            if(used[t[i]] != 0) {
                return false;
            }
            charMap[s[i]] = t[i];
            used[t[i]] = s[i];
        }
    }
    return true;
}


pair<string,string> generateIsomorphic(int size, double probability) {
    static const string characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    string notUsed = characters;
    std::shuffle(notUsed.begin(), notUsed.end(), singleRNG());

    double elementProbability = pow(probability,size);
    string input1;
    string input2;
    map<char, char> charMap;
    set<char> used;
    for(int i = 0; i < size; ++i) {
        char char1 = characters[randomInt(characters.size())];
        input1 += char1;
        char char2;
        auto it = charMap.find(char1);
        if(it != charMap.end()) {
            char2 = charMap[char1];
        } else {
            // Choose new char2 not used before
            auto it2 = notUsed.begin();
            char char2 = *it2;
            notUsed.erase(it2);
            charMap[char1] = char2;
        }

        // Use elementProbability to either set char2 or any other character
        // This one deviates a little because we are choosing from all chars instead
        if(randomProbability() < elementProbability) {
            input2 += char2;
        } else {
            input2 += characters[randomInt(characters.size())];
        }
    }
    return pair<string,string>{input1,input2};
}
typedef  bool(*isIsomorphicFunc)(const string&,const string&);

long long test(const vector<pair<string,string>> &data, isIsomorphicFunc isIsomorphic) {
    std::chrono::steady_clock::time_point begin = std::chrono::steady_clock::now();
    for(const auto &p : data){
        isIsomorphic(p.first, p.second);
    }
    std::chrono::steady_clock::time_point end = std::chrono::steady_clock::now();
    return std::chrono::duration_cast<std::chrono::microseconds> (end - begin).count();
}

vector<vector<double>> testRunner(const vector<pair<string,string>> &data, const vector<isIsomorphicFunc> &arrayOfFunc, int repeat = 1000) {
    vector<vector<double>> result;
    vector<pair<int,isIsomorphicFunc>> sample;
    auto &rng = singleRNG();

    for(int i = 0; i < arrayOfFunc.size(); ++i) {
        result.emplace_back();
        sample.emplace_back(i, arrayOfFunc[i]);
    }

    for(int i = 0; i < repeat; ++i){
        std::shuffle(std::begin(sample), std::end(sample), rng);
        for( auto p : sample) {
            result[p.first].push_back((double)test(data, p.second));
        }
    }
    
    return result;
}

double avg(const vector<double> &d) {
    return std::accumulate(d.begin(), d.end(), 0) / d.size();
}

int main() {
    const double probability = 0.5;
    const int total = 1000;
    vector<pair<string,string>> data;
    for(int i = 0; i < total; ++i) {
        const int size = randomInt(1000);
        data.emplace_back(generateIsomorphic(size,probability));
    }

    const vector<vector<double>> results = testRunner(data, vector<isIsomorphicFunc>{
        isIsomorphicStd,
        isIsomorphicArray
    });

    cout << "isIsomorphicStd => " << avg(results[0])/1000 << endl;
    cout << "isIsomorphicArray => " << avg(results[1])/1000 << endl;
}