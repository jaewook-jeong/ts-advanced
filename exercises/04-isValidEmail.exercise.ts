/**
 * π§βπ» Here, we've got some code that checks if a user's
 * email is valid before creating them. There's some special
 * TypeScript magic happening to ENSURE that we can't create
 * a user if we haven't already checked that their email
 * is valid, using a pattern called 'opaque types'.
 */
/**
 Opaque ν¨ν΄μ μ¬μ©νμ¬ μ΄λ©μΌμ΄ μ ν¨νμ§ μμ§ νμΈνμ§ μμ κ²½μ° μ¬μ©μλ₯Ό λ§λ€ μ μλλ‘ νλ
 * */

/**
 * π§βπ» This is the helper at the heart of the operation. It takes
 * two generic slots, one for a value and one for a TOpaque.
 */
type Opaque<TValue, TOpaque> = TValue & {
  __: TOpaque;
};

type ValidEmail = Opaque<string, "ValidEmail">;
/**  ^ π
 *
 * π Hover ValidEmail. This appears to be a string with an extra
 * property added to it.
 *
 * π΅οΈββοΈ Try creating a new type, ValidAge, which creates an opaque
 * type from a number.
 **/
type ValidAge = Opaque<number, "ValidAge">;
 /**
 *
 *      ^ π
 *
 * This should also be valid, and look similar to ValidEmail.
 */

const isValidEmail = (email: string): email is ValidEmail => {
  //  ^ π
  return email.includes("@");
};

/**
 * π Hover isValidEmail - there's some new syntax here. Returning
 * email is ValidEmail? Intriguing.
 *
 * π΅οΈββοΈ Remove email is ValidEmail from the return type of isValidEmail:
 *
 **/
  const isValidEmailTemp = (email: string) => {
    return email.includes("@");
  };

/* *
 * βοΈ A wild error appears!
 *
 * Type 'string' is not assignable to type 'ValidEmail'.
 *
 * OK, looks like that bit of code is important.
 *
 * π  Add the email is ValidEmail back:
 *
 * const isValidEmail = (email: string): email is ValidEmail => {
 */

/**
 * π§βπ» Here, we can see that createUser takes in an object where
 * email isn't a string, it's a ValidEmail!
 */
const createUser = async (user: { email: ValidEmail }) => {
  // Pseudocode, creates a user in the database
  return user;
};

/**
 * π§βπ» Finally, onSubmit takes in some values which contain { email: string }.
 * We check if the email is valid, and then pass it to createUser.
 */
export const onSubmit = async (values: { email: string }) => {
  if (!isValidEmail(values.email)) {
    throw new Error("Email is invalid");
  }

  /**
   * π΅οΈββοΈ Try commenting out the entire if statement above:
   *
   * βοΈ It's back!
   *
   * Type 'string' is not assignable to type 'ValidEmail'.
   *
   * π  Uncomment the lines above to remove the error.
   */

  await createUser({
    email: values.email,
  });
};

/**
 * π‘ From the above code, it looks like ValidEmail is
 * a special type of string - one that MUST be validated
 * by an isValidEmail check.
 *
 * π  Let's check if that's true. Create a new variable,
 * email, annotated as a ValidEmail.
 *
 *
 */
const email: ValidEmail = "team@totaltypescript.com";
/**
 * βοΈ Error on email!
 *
 * Type 'string' is not assignable to type 'ValidEmail'.
 *
 * "team@totaltypescript.com" is inferred as a string,
 * which fails because it doesn't fit the ValidEmail
 * type.
 *
 * π΅οΈββοΈ If we were to _cast_ "team@totaltypescript.com" to
 * a ValidEmail, it would work. Try it out:
 *
 * const email = "team@totaltypescript.com" as ValidEmail;
 *       ^ π
 *
 * π It's working! It's inferred as ValidEmail. That's because
 * string is _close enough_ to ValidEmail that we can cast it
 * just fine.
 */
const email = "team@totaltypescript.com" as ValidEmail;
const email = 12 as ValidEmail;
/**
 * π΅οΈββοΈ Try breaking it by changing "team@totaltypescript.com" to
 * a number:
 *
 * const email = 12 as ValidEmail;
 *
 * βοΈ Big error incoming:
 *
 * Conversion of type 'number' to type 'ValidEmail' may be a mistake
 * because neither type sufficiently overlaps with the other. If
 * this was intentional, convert the expression to 'unknown' first.
 *
 * This is because number is SO far from ValidEmail that they're
 * not even comparable.
 *
 * π  Revert it to "team@totaltypescript.com".
 */

/**
 * π‘ OK, now we've figured out that ValidEmail is a different type
 * from string, let's now break down the isValidEmail function.
 *
 * π  Comment out isValidEmail. Recreate it as a function that
 * takes in email: string with an empty function body:
 *
 * const isValidEmail = (email: string) => {};
 */

/**
 * βοΈ Errors, as expected:
 *
 * An expression of type 'void' cannot be tested for truthiness.
 *
 * This is because our function isn't returning a boolean
 * any more.
 *
 * π  Return email.includes("@"); from the function.
 *
 * βοΈ There's still one more around:
 *
 * Type 'string' is not assignable to type 'ValidEmail'.
 */

/**
 * π‘ isValidEmail currently doesn't do anything to ensure that
 * the string that's passed in gets resolved to a ValidEmail. There's
 * two ways we can achieve this.
 *
 * The first is using a type predicate:
 *
 * https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 *
 * π  Change the return type of isValidEmail to email is ValidEmail:
 *
 * const isValidEmail = (email: string): email is ValidEmail => {
 *
 * β The error disappeared! Let's understand why:
 *
 * π΅οΈββοΈ Inside the conditional check which throws the error, try removing
 * the exclamation mark in front of isValidEmail:
 *
 * if (isValidEmail(values.email)) {
 *   throw new Error("Email is invalid");
 * }
 *
 * You'll notice the error comes back. Discuss with your group why
 * you think this might be happening. Put the exclamation mark back
 * before continuing.
 */

/**
 * π‘ You'll notice that using a type predicate is sort of like using 'as'.
 * We're telling TypeScript that email isn't a string, it's a ValidEmail
 * type, but without actually adding the required field of __: 'ValidEmail'.
 *
 * This is what type predicates do - they let you specify your own logic
 * for resolving the type of something. When paired with an Opaque<> type
 * helper, it can let you be extremely confident of the shape of your code.
 */

/**
 * π‘ We can also use an assertion function for the same check. That helps
 * colocate the error logic with the check itself. More info:
 *
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions
 *
 * Let's try it:
 *
 * π  Rename isValidEmail to assertsValidEmail.
 *
 * π  Change the check in the function to remove the if statement, and instead
 * just call the function assertsValidEmail on values.email:
 *
 * assertsValidEmail(values.email);
 *
 * π  Change the return type of assertsValidEmail to asserts email is ValidEmail
 *
 * const assertsValidEmail = (email: string): asserts email is ValidEmail => {
 *
 * βοΈ Holy errors, Batman!
 *
 * Let's start with the one inside the assertsValidEmail function.
 *
 * Type 'boolean' is not assignable to type 'void'.
 *
 * Assertion functions can't return anything - they must return nothing. That
 * means we need to move the error logic inside our assertion function instead
 * of just returning a boolean.
 *
 * π  Change the function body of assertsValidEmail to throw an error if the
 * email isn't valid:
 *
 * if (!email.includes("@")) {
 *   throw new Error("Invalid email");
 * }
 */

/**
 * βοΈ OK, that helped a little. But there's still more out there.
 *
 * Assertions require every name in the call target to be declared with an
 * explicit type annotation.
 *
 * This is one of the ALL TIME WORST TS ERRORS out there. The fix is deeply
 * counter-intuitive. Assertion functions can't be declared as arrow functions.
 * So if we declare it as a function() {}, the error will go away.
 *
 * π  Change assertsValidEmail from an arrow function to a traditional function:
 *
 * function assertsValidEmail(email: string): asserts email is ValidEmail {
 *
 * β The errors are gone! The code inside onSubmit is now impressively concise.
 * We've moved the erroring logic into the assertion function. If we don't call
 * the assertion function, createUser will yell at us that we haven't checked
 * that the email is valid.
 */

/**
 * π‘ Great job! The Opaque type helper is great for creating these opaque
 * types. For more information, check out this great article:
 *
 * https://codemix.com/opaque-types-in-javascript/
 *
 * We also covered type predicates and assertion functions. They can be used
 * for plenty of type magic on their own, but when combined with opaque types
 * that can be extremely useful.
 */

/**
 * π΅οΈββοΈ Stretch goal 1:
 *
 * Create two Opaque types - one called PostId, another called UserId.
 * Create two functions - getPostById and getUserById. Make each only
 * take their specific types of id as a parameter.
 *
 * Try calling getUserById("123"); You'll notice that you get an error:
 *
 * Argument of type 'string' is not assignable to parameter of type 'UserId'.
 *
 * Discuss the best way to solve this. You could consider:
 *
 * A type predicate.
 * Casting using as.
 * An assertion function.
 *
 * Solution #1
 */

/**
 * #1 below:
 */

export type Opaque2<TValue, TOpaque> = TValue & {
  __: TOpaque;
};

type PostId = Opaque2<string, "PostId">;
type UserId = Opaque2<string, "UserId">;

const getUserById = (id: UserId) => {};
const getPostById = (id: PostId) => {};

// Method 1 - assertion function

function assertIsUserId(id: any): asserts id is UserId {}

const id = "123";
assertIsUserId(id);
getUserById(id);

// Method 2 - type predicate

function isUserId(id: any): id is UserId {
  return true;
}

const id2 = "123";
if (isUserId(id2)) {
  getUserById(id2);
}

// Method 3 - casting

getUserById("123" as UserId);
