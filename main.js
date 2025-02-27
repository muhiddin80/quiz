const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { readFileCustom, writeFileCustom } = require("./helpers/function");
let data = readFileCustom("./data/quizes.json");

const server = http.createServer((req, res) => {
    const urls = req.url.split("/");
    const method = req.method;
    if (method === "GET") {
        console.log("Received GET request:", urls);
        if (urls[1] === "quizes" && urls[2] && !isNaN(Number(urls[2]))) {
            let quizId = Number(urls[2]);
            let quizIndex = data.findIndex(el => el.id === quizId);
            if (quizIndex === -1) {
                res.writeHead(404);
                res.end("Quiz not found");
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data[quizIndex]));
            }
        } 
        else if (urls[1] === "quizes" && urls[2] === null) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } 
        else {
            const filePath = path.join(process.cwd(), "index.html"); 
            const mineTypes = { ".html": "text/html" };
            fs.readFile(filePath, "utf8", (err, html) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Error reading HTML file");
                    return;
                }
                let quizhtml = "";
                data.forEach(quiz => {
                    quizhtml += `
                    <div class="quiz">
                        <h2>${quiz.id}</h2>
                        <p>${quiz.title}</p>
                        <ul>
                            <li>${quiz.answers[1].answer_title}</li>
                            <li>${quiz.answers[2].answer_title}</li>
                            <li>${quiz.answers[2].answer_title}</li>
                            <li>${quiz.answers[2].answer_title}</li>
                        </ul>
                    </div>
                    `;
                });
                html = html.replace("<!--Quizlarni ko'chiradigan joy-->", quizhtml);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(html);
            });
        }
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
    if (method === "POST") {
        if (urls[1] == "quizes" && (urls[2] === undefined || urls[2] === "")) {
            let body = "";
            console.log("quizda answers(arrayda bo'lsin va answer_title va answer_id va is_correct bo'lsin) va title bo'lsin");

            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", () => {
                const newQuiz = JSON.parse(body);
                newQuiz.id = data.length + 1;
                console.log(newQuiz);

                data.push(newQuiz);
                writeFileCustom("./data/quizes.json", data);
                res.writeHead(200);
                res.end("Quiz successfully added");
            });
        } else {
            res.writeHead(404);
            res.end("Xato url");
        }
    }
//     if (method === "PUT" && urls[1] === "quizes" && urls[2] === 'update' && urls[3]) {
//         let body = "";
//         req.on("data", (chunk) => {
//             body += chunk.toString();
//         });

//         req.on("end", () => {
//             const quizId = Number(urls[3]);
//             if (isNaN(quizId)) {
//                 res.writeHead(400, { "Content-Type": "text/plain" });
//                 res.end("xato ID");
//                 return;
//             }

//             const updatedQuiz = JSON.parse(body);
//             const quizIndex = data.findIndex(el => el.id === quizId);
//             updatedQuiz.id = quizId;

//             if (quizIndex === -1) {
//                 res.writeHead(404, { "Content-Type": "text/plain" });
//                 res.end("Quiz not found");
//                 return;
//             }

//             if (JSON.stringify(updatedQuiz.answers) !== JSON.stringify(data[quizIndex].answers) || updatedQuiz.title !== data[quizIndex].title) {
//                 data.splice(quizIndex, 1, updatedQuiz);
//                 writeFileCustom("./data/quizes.json", data);

//                 res.writeHead(200, { "Content-Type": "application/json" });
//                 res.end("Quiz updated successfully");

//                 console.log(data[quizIndex]);
//             } else {
//                 res.writeHead(400, { "Content-Type": "text/plain" });
//                 res.end("No changes detected");
//             }
//         });
//     }

//     if (method === "PATCH" && urls[1] === "quizes" && urls[2] === 'update' && urls[3]) {
//         let body = "";
//         req.on("data", (chunk) => {
//             body += chunk.toString();
//         });

//         req.on("end", () => {
//             const quizId = Number(urls[3]);
//             if (isNaN(quizId)) {
//                 res.writeHead(400, { "Content-Type": "text/plain" });
//                 res.end("xato ID");
//                 return;
//             }

//             const updatedQuiz = JSON.parse(body);
//             const quizIndex = data.findIndex(el => el.id === quizId);
//             updatedQuiz.id = quizId;

//             if (quizIndex === -1) {
//                 res.writeHead(404, { "Content-Type": "text/plain" });
//                 res.end("Quiz not found");
//                 return;
//             }

//             const currentQuiz = data[quizIndex];
//             const mergedQuiz = { ...currentQuiz, ...updatedQuiz };

//             data.splice(quizIndex,1,mergedQuiz);
//             writeFileCustom("./data/quizes.json", data);

//             res.writeHead(200, { "Content-Type": "application/json" });
//             res.end("Quiz updated successfully");

//             console.log(data[quizIndex]);
//         });
//     }

//     if (method === "DELETE" && urls[1] === "quizes" && urls[2] && !isNaN(Number(urls[2]))) {
//         const quizId = Number(urls[2]);
//         const quizIndex = data.findIndex(el => el.id === quizId);

//         if (quizIndex === -1) {
//             res.writeHead(404, { "Content-Type": "text/plain" });
//             res.end("Quiz not found");
//         } else {
//             data.splice(quizIndex, 1);
//             writeFileCustom("./data/quizes.json", data);
//             res.writeHead(200, { "Content-Type": "text/plain" });
//             res.end("Quiz deleted successfully");
//         }
//     }
});
server.listen(4000, "localhost", () => {
    console.log("server is running on port 4000");
});
