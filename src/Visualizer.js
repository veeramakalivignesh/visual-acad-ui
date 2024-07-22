import React from "react"

const Visualizer = () => {
  return (
    <div class="mermaid">
      graph TB
        A[13,032] =&gt; |Accept John's Offer| B[12,000]
        A ==&gt;  C[$13,032]
        C ==&gt; |Offer from Vanessa 0.6| D[$14,000]
        D --&gt; |Accept Vanessa's Offer| E[$14,000]
        D --&gt; |Reject Vanessa's Offer| F[$11,580]
        C --&gt; |No Offer from Vanessa 0.4| G[$11,580]
        G --&gt; |Salary 1 0.05| H[$21,600]
        G --&gt; |Salary 2 0.25| I[$16,800]
        G --&gt; |Salary 3 0.40| J[$12,800]
        G --&gt; |Salary 4 0.25| K[$6,000]
        G --&gt; |Salary 5 0.05| L[$0]
        F --&gt; |Salary 1 0.05| M[$21,600]
        F --&gt; |Salary 2 0.25| N[$16,800]
        F --&gt; |Salary 3 0.40| O[$12,800]
        F --&gt; |Salary 4 0.25| P[$6,000]
        F --&gt; |Salary 5 0.05| Q[$0]
    </div>
  )

}
export default Visualizer;