<p><%=message%></p>   
<% const dollarUSLocale = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2}) %> 
<div> 
<div>
    <div>
      <h5><%=p.name%> (<%=p.ticker%>)</h5>
      <h6><%=p.exchange%>. Currency in <%=p.currency%></h6>
    </div>
    <h3><%=parseFloat(gq["05. price"])%> 
        
    <%if(gq["09. change"] < 0){%> 
        
    <% }else{ %> 
        
    <% }%>
    <%=parseFloat(gq["09. change"])%> 

    <%if(parseFloat(gq["10. change percent"]) < 0){%> 
        
    <% }else{ %> 
        
    <% }%>
    (<%=gq["10. change percent"]%>)
    
    
    </h3>
    <a href="/watchlist/addstock?symbol=<%=p.ticker%>&name=<%=p.name%>" >⭐ Add to watchlist</a>
    <!-- <svg xmlns="http://www.w3.org/2000/svg" class="d-block user-select-none" width="100%" height="200" aria-label="Placeholder: Image cap" focusable="false" role="img" preserveAspectRatio="xMidYMid slice" viewBox="0 0 318 180" style="font-size:1.125rem;text-anchor:middle">
      <rect width="100%" height="100%" fill="#868e96"></rect>
      <text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text>
    </svg> -->
    <div>
      <p>Summary</p>
    </div>
    <div>
        <table>
            <tbody>
                <tr>
                    <td style="width:25%">Previous Close </th>
                    <td style="border-right: .05rem solid #d1d1cf;width:25%;text-align: right;"><%=parseFloat(gq["08. previous close"])%></td>
                    <td style="width:25%">High </td>
                    <td style="width:25%;text-align: right;"><%=parseFloat(gq["03. high"])%></td>
                </tr>
                <tr>
                    <td style="width:25%">Open</th>
                    <td style="border-right: .05rem solid #d1d1cf;width:25%;text-align: right;"><%=parseFloat(gq["02. open"])%></td>
                    <td style="width:25%">Low </td>
                    <td style="width:25%;text-align: right;"><%=parseFloat(gq["04. low"])%></td>
                </tr>
                <tr>
                    <td style="width:25%">Volume </th>
                    <td style="border-right: .05rem solid #d1d1cf;width:25%;text-align: right;"><%= gq["06. volume"] %></td>
                    <td style="width:25%">&nbsp;</td>
                    <td style="width:25%">&nbsp;</td>
                </tr>
            </tbody>
        </table>
    </div>    
    <!-- <div>
      <a href="#" class="card-link">Card link</a>
      <a href="#" class="card-link">Another link</a>
    </div> -->
    <div>
        Latest Trading Day : <%=gq["07. latest trading day"]%>
    </div>
  </div>
  <div>
    <div>
      <h4>Card title</h4>
      <h6>Card subtitle</h6>
      <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      <a href="#">Card link</a>
      <a href="#">Another link</a>
    </div>
  </div>
</div>
