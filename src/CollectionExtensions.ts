import { Injector } from "@furystack/inject";
import { IDisposable } from "@sensenet/client-utils";
import { IActivateable } from "./Models/IActivateable";
import { IService } from "./Models/IService";

export const attachCollectionBehaviour = <K, T extends Iterable<K>= Iterable<K>>(collection: T, behaviour: (collection: T & K) => T & K) => behaviour(collection as T & K);
export const makeCollectionActivateable = <T extends IActivateable, T2 extends Iterable<T>>(collection: T2) => attachCollectionBehaviour<T, T2>(collection, (c) => {
    c.activate = async () => {
        await Promise.all(Array.from(collection).map((item) => item.activate()));
    };
    return c;
});

export const makeCollectionDisposable = <T extends IDisposable, T2 extends Iterable<T>>(collection: T2) => attachCollectionBehaviour<T, T2>(collection, (c) => {
    c.dispose = async () => {
        await Promise.all(Array.from(collection).map((item) => item.dispose()));
    };
    return c;
});

export const makeServiceCollection = <T extends IService, T2 extends Iterable<T>>(collection: T2) => attachCollectionBehaviour<T, T2>(collection, (c) => {
    (c as any).isRunning = false;
    c.start = async () => {
        await Promise.all(Array.from(collection).map((item) => item.start()));
        (c as any).isRunning = true;
    };
    c.stop = async () => {
        await Promise.all(Array.from(collection).map((item) => item.stop()));
        (c as any).isRunning = false;
    };
    return c;
});

export const setParentInjector = <TItem extends {injector: Injector}, TCollection extends Iterable<TItem>>(collection: TCollection, parentInjector: Injector) => {
    Array.from(collection).map((c) => {
        c.injector.options.parent = parentInjector;
        return c as TItem;
    });
    return collection;
};
