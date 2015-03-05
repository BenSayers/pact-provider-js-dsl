var program = require('commander');
var pactVerifyTask = require('./pact-verify-task');

program
    .option('-f, --pactFile <pactFile>', 'The pact file from the consumer')
    .option('-h, --pactHelper <pactHelper>', 'The provider state change helper')
    .parse(process.argv);

pactVerifyTask(program.pactFile, program.pactHelper);