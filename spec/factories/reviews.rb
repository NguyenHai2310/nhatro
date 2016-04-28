FactoryGirl.define do
  factory :review do
    content {Faker::Lorem.paragraph 2, true}
    # point {rand 1..5}
    user

    after(:build) do |review|
      review.comments << FactoryGirl.build(:comment, review: review)
    end
  end
end
