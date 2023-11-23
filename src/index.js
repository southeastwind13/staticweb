import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import DocumentMeta from 'react-document-meta';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'

const meta = {
    title: 'Patrick\'s Resume',
    description: 'Patrick Kelly\'s Resume',
    meta: {
      charset: 'utf-8',
      name: {
        keywords: 'resume, portfolio, patrick kelly, kuscko, software developer, web developer, full stack developer, '+
        'react, reactjs, react.js, javascript, js, html, css, python, django, sql, mysql, postgresql, postgres, mongodb, '+
        'mongo, azure, dotnet, .net, .net core, core, c#, csharp, c sharp, c-sharp, asp.net, aspnet, asp.net core, aspnetcore, asp.net mvc, aspnetmvc, mvc, mvc.net'
      }
    }
  }

ReactDOM.render(
    <DocumentMeta {...meta}>
        <App />
    </DocumentMeta>, document.getElementById('root'));
