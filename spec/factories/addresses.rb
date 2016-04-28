FactoryGirl.define do
  factory :address do
    contact {Faker::PhoneNumber.cell_phone}
    address {["nha tro ha noi", "nha tro gia re"].sample}
    description {Faker::Lorem.paragraph(6, true)}
    lat {rand 20.0..22.0}
    lng {rand 105.0..106.0}
    capacity {rand 1..10}
    rating {rand 1..5}
    title {Faker::Lorem.sentence}
    user
    region
    square {rand 10..60}
    parking {[true, false].sample}
    network {[true, false].sample}
    table {[true, false].sample}
    chair {[true, false].sample}
    air_conditioner {[true, false].sample}
    television {[true, false].sample}
    washing_machine {[true, false].sample}
    bed {[true, false].sample}
    ceiling_fan {[true, false].sample}
    price {rand(1..10)*1000000}
    house {rand(0..1)}
    # point {rand 0..10}

    after(:build) do |address|
      address.reviews << FactoryGirl.build(:review, address: address)
      Settings.image_sample.each do |url|
        address.images << FactoryGirl.build(:image, address: address,
                                            photo: Rack::Test::UploadedFile.new(File.open(File.join(Rails.root, url))))
      end
    end
  end
end
