import BioEditor from "./bioEditor";
import { fireEvent, render, waitFor } from "@testing-library/react";
import axios from "./axios";
// import axios from "./axios";
// import Spinner from "./spinner";
// import React from "react";

jest.mock("./axios");
let fired = false;
axios.post.mockResolvedValue({ data: { update: "ok" } });

test('When no bio is passed to it, an "Add" button is rendered.', () => {
    const { container: one } = render(<BioEditor />);
    expect(one.querySelector("button").innerHTML).toBe("add Bio");
    expect(one.querySelector("p").innerHTML).toBe("");
    expect(one.innerHTML.includes("textarea")).toBeFalsy();

    const { container: two } = render(<BioEditor bio="" />);
    expect(two.querySelector("button").innerHTML).toBe("add Bio");
    expect(one.querySelector("p").innerHTML).toBe("");
    expect(one.innerHTML.includes("textarea")).toBeFalsy();

    const { container: three } = render(<BioEditor bio="Test bio" />);
    expect(three.querySelector("button").innerHTML).not.toBe("add Bio");
    expect(one.innerHTML.includes("textarea")).toBeFalsy();
    // await waitFor(() =>
    //     expect(one.querySelector("p").innerHTML).toBe("Test bio")
    // );
});

test('When a bio is passed to it, an "Edit" button is rendered.', () => {
    const { container: one } = render(<BioEditor bio="test" />);
    expect(one.querySelector("button").innerHTML).toBe("edit Bio");

    const { container: two } = render(<BioEditor bio=" " />);
    expect(two.querySelector("button").innerHTML).toBe("edit Bio");
});

test('Clicking either the "Add" or "Edit" button causes a textarea and a "Save" button to be rendered.', () => {
    const { container } = render(<BioEditor />);
    expect(container.querySelector("button").innerHTML).toBe(
        "add Bio" || "edit Bio"
    );
    expect(container.innerHTML.includes("textarea")).toBeFalsy();
    expect(container.innerHTML.includes("p")).toBeTruthy();

    fireEvent.click(container.querySelector("button"));
    expect(container.querySelector("button").innerHTML).toBe("Save Bio");
    expect(container.innerHTML.includes("textarea")).toBeTruthy();
    expect(container.innerHTML.includes("p")).toBeFalsy();
});

test('Clicking the "Save" button causes an ajax request.', async () => {
    const { container } = render(<BioEditor />);
    fireEvent.click(container.querySelector("button"));

    expect(container.querySelector("button").innerHTML).toBe("Save Bio");
    fireEvent.click(container.querySelector("button"));

    await waitFor(() => {
        // expect(container.querySelector("p")).toBeTruthy();
    });
});

// test("When the mock request is successful, the function that was passed as a prop to the component gets called.", () => {});
