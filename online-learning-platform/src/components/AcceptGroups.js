import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

export const AcceptGroups = ({ title, imageUrl, desc }) => {
  const header = <img alt="Card" src={imageUrl} />;
  const footer = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button label="Save" icon="pi pi-check" />
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-outlined p-button-secondary"
      />
    </div>
  );

  return (
    <div className="card flex justify-content-center">
      <Card
        title={title}
        subTitle="Subtitle"
        footer={footer}
        header={header}
        className="md:w-25rem"
      >
        <p className="m-0">{desc}</p>
      </Card>
    </div>
  );
};
export default AcceptGroups;
