import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase/clientApp.ts";

export const migrateProjectOrders = async () => {
  try {
    const projectsCollection = collection(db, "projects");
    const querySnapshot = await getDocs(projectsCollection);
    
    const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
      const projectData = docSnapshot.data();
      
      // Only update documents that don't have an order field
      if (!('order' in projectData)) {
        return updateDoc(doc(db, 'projects', docSnapshot.id), {
          order: 0
        });
      }
      return Promise.resolve();
    });

    await Promise.all(updatePromises);
    console.log('Successfully migrated project orders');
    return true;
  } catch (error) {
    console.error('Error migrating project orders:', error);
    return false;
  }
};