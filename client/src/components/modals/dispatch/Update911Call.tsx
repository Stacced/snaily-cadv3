import * as React from "react";
import Modal from "../index";
import lang from "../../../language.json";
import Call, { Unit } from "../../../interfaces/Call";
import { connect } from "react-redux";
import { end911Call, update911Call } from "../../../lib/actions/911-calls";
import { addCallEvent } from "../../../lib/actions/dispatch";
import { getValuesByPath } from "../../../lib/actions/values";
import Officer from "../../../interfaces/Officer";
import State from "../../../interfaces/State";
import Deputy from "../../../interfaces/Deputy";
import Select, { Value as SelectValue } from "../../select";
import Value from "../../../interfaces/Value";
import { modal } from "../../../lib/functions";
import { ModalIds } from "../../../lib/types";
import ValuePaths from "../../../interfaces/ValuePaths";

interface Props {
  call: Call | null;
  officers: Officer[];
  ems_fd: Deputy[];
  callTypes: Value[];
  getValuesByPath: (path: ValuePaths) => void;
  end911Call: (id: string) => void;
  update911Call: (id: string, data: Partial<Call>) => void;
  addCallEvent: (callId: string, text: string) => void;
}

const Update911Call: React.FC<Props> = ({
  call,
  officers: activeOfficers,
  ems_fd: activeEmsFdDeputies,
  callTypes,
  getValuesByPath,
  end911Call,
  update911Call,
  addCallEvent,
}) => {
  const [location, setLocation] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [type, setType] = React.useState<SelectValue | null>(null);
  const [assignedUnits, setAssignedUnits] = React.useState<Unit[]>([]);

  const [eventText, setEventText] = React.useState<string>("");
  const [activeUnits, setActiveUnits] = React.useState<(Officer | Deputy)[]>([]);
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  const inputRef = React.createRef<HTMLInputElement>();

  React.useEffect(() => {
    setLocation(call?.location ?? "");
    setDescription(call?.description ?? "");
    setType({ label: call?.type ?? "", value: call?.type ?? "" });
    setAssignedUnits(call?.assigned_unit!);
  }, [call]);

  React.useEffect(() => {
    getValuesByPath("call-types");
  }, [getValuesByPath]);

  React.useEffect(() => {
    setActiveUnits([...activeEmsFdDeputies, ...activeOfficers]);
  }, [activeOfficers, activeEmsFdDeputies]);

  function closeModal() {
    modal(ModalIds.Update911Call).hide();
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!call) return;
    closeModal();

    update911Call(call.id, {
      location,
      description,
      assigned_unit: assignedUnits,
      hidden: call.hidden,
      type: type?.value,
    });
  }

  function handleCancelCall() {
    if (!call) return;

    closeModal();
    end911Call(call.id);
  }

  function handleClick(e: any) {
    setAssignedUnits(e);
  }

  function handleAddEvent() {
    if (!call) return;

    addCallEvent(call.id, eventText);
    setEventText("");
    inputRef.current?.focus();
  }

  return (
    <Modal title={lang.dispatch.update_911_call} size="lg" id={ModalIds.Update911Call}>
      <form id="updateCallForm" onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="call_location">
              {lang.global.location}
            </label>
            <input
              id="call_location"
              className="form-control bg-secondary border-secondary text-light"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="call_description">
              {lang.global.description}
            </label>
            <input
              id="call_description"
              className="form-control bg-secondary border-secondary text-light"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="call_description">
              {lang.citizen.medical.type2}
            </label>
            <Select
              value={type}
              options={callTypes.map((v) => ({ value: v.name, label: v.name }))}
              onChange={(v) => setType(v)}
              closeMenuOnSelect
              isClearable={false}
              isMulti={false}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="call_assigned_unit">
              {lang.dispatch.assigned_unit}
            </label>
            {!activeUnits[0] ? (
              <p>{lang.dispatch.no_units}</p>
            ) : (
              <Select
                value={assignedUnits}
                closeMenuOnSelect={false}
                defaultValue={assignedUnits}
                onChange={handleClick}
                options={activeUnits.map((unit) => ({
                  value: "officer_name" in unit ? unit.id : unit.id,
                  label:
                    "officer_name" in unit ? `${unit.callsign} ${unit.officer_name}` : unit.name,
                }))}
              />
            )}
          </div>

          <div className="mt-4 mb-3">
            <div id="addEventForm" className="d-flex justify-content-between">
              <h1 className="h3">{window.lang.dispatch.events}</h1>

              <div>
                <button
                  onClick={() => setShowAdd((v) => !v)}
                  type="button"
                  className="btn btn-primary"
                >
                  {window.lang.dispatch.add_event}
                </button>
              </div>
            </div>

            {showAdd ? (
              <div className="mb-3">
                <label htmlFor="text" className="form-label">
                  {window.lang.dispatch.event}
                </label>

                <div className="d-flex">
                  <input
                    ref={inputRef}
                    form="addEventForm"
                    className="bg-secondary border-secondary text-light form-control"
                    value={eventText}
                    onChange={(e) => setEventText(e.target.value)}
                  />

                  <button
                    form="addEventForm"
                    type="button"
                    onClick={handleAddEvent}
                    style={{ marginLeft: "0.5rem" }}
                    className="btn btn-primary"
                  >
                    {window.lang.codes.add_code}
                  </button>
                </div>
              </div>
            ) : null}

            <ul style={{ maxHeight: "15rem" }} className="list-group overflow-auto">
              {call?.events && call.events.length <= 0 ? (
                <p>{window.lang.dispatch.no_events}</p>
              ) : (
                call?.events
                  ?.sort((a, b) => Number(b.date) - Number(a.date))
                  .map((event) => {
                    const date = new Date(Number(event.date));
                    const HOUR = date.getUTCHours();
                    const MINUTES = date.getMinutes();

                    return (
                      <p style={{ margin: "0 0" }} key={event.id}>
                        [UTC - {HOUR}:{MINUTES}] - {event.text}
                      </p>
                    );
                  })
              )}
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button onClick={handleCancelCall} type="button" className="btn btn-danger">
            {lang.tow.end_call}
          </button>
          <button type="submit" className="btn btn-success">
            {lang.dispatch.update_call}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  officers: state.dispatch.officers,
  ems_fd: state.dispatch.ems_fd,
  callTypes: state.values["call-types"],
});

export default connect(mapToProps, { end911Call, update911Call, addCallEvent, getValuesByPath })(
  Update911Call,
);
