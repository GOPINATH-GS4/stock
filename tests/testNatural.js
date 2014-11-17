var natural = require('natural');

var classifier = new natural.BayesClassifier();

classifier.addDocument('melanoma with results', 'cond:melanoma,rslt:With');
classifier.addDocument('melanoma containing results', 'cond:melanoma,rslt:With');
classifier.addDocument('melanoma results is available', 'cond:melanoma,rslt:With');
classifier.addDocument('melanoma results is true', 'cond:melanoma,rslt:With');

classifier.train();

console.log(classifier.classify('melanoma get results'));
