import {Helmet} from "react-helmet";

function PageSettings({title}) {
  return (
    <Helmet>
      <body className="font-hamop bg-gray-100"/>

      { title && (
        <title>{title} - hamop.gr</title>
      )}
    </Helmet>
  )
}

export default PageSettings